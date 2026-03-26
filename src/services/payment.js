import iyzico from '../utils/iyzico.js';
import { OrdersCollection } from '../db/models/order.js';
import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import { sendOrderSuccessEmails } from './mailService.js';

export const processPayment = async (order, user, ip, cardDetails) => {
    if (iyzico._disabled) {
        throw createHttpError(503, 'Payment service is currently unavailable.');
    }
    const request = {
        locale: 'tr',
        conversationId: order._id.toString(),
        price: order.totalPrice.toFixed(2),
        paidPrice: order.totalPrice.toFixed(2),
        currency: 'TRY',
        basketId: order._id.toString(),
        paymentGroup: 'PRODUCT',
        paymentChannel: 'WEB',
        paymentCard: {
            cardHolderName: cardDetails.cardHolderName,
            cardNumber: cardDetails.cardNumber,
            expireMonth: cardDetails.expireMonth,
            expireYear: cardDetails.expireYear,
            cvc: cardDetails.cvc,
            registerCard: '0' // Kartı kaydetme
        },
        buyer: {
            id: user._id.toString(),
            name: user.name,
            surname: user.surname || user.name, // Fallback
            gsmNumber: order.contactNumber || user.telephone || '+905555555555',
            email: user.email,
            identityNumber: '11111111111', // Zorunlu alan, kullanıcıdan alınmalı aslında
            lastLoginDate: '2024-01-01 10:00:00',
            registrationDate: '2024-01-01 10:00:00',
            registrationAddress: order.address.street,
            ip: ip,
            city: order.address.city,
            country: order.address.country,
            zipCode: order.address.zip,
        },
        shippingAddress: {
            contactName: `${user.name}`,
            city: order.address.city,
            country: order.address.country,
            address: order.address.street,
            zipCode: order.address.zip,
        },
        billingAddress: {
            contactName: `${user.name}`,
            city: order.address.city,
            country: order.address.country,
            address: order.address.street,
            zipCode: order.address.zip,
        },
        basketItems: [
            ...order.items.map((item) => ({
                id: item.productId._id.toString(),
                name: item.productId.title || 'Product',
                category1: 'General',
                itemType: 'PHYSICAL',
                price: (item.price * item.quantity).toFixed(2),
            })),
            ...(order.isGiftWrap ? [{
                id: 'GIFT_WRAP',
                name: 'Hediye Paketi',
                category1: 'Service',
                itemType: 'VIRTUAL',
                price: '50.00',
            }] : []),
            ...(order.shippingCost > 0 ? [{
                id: 'SHIPPING',
                name: 'Kargo Ücreti',
                category1: 'Service',
                itemType: 'VIRTUAL',
                price: order.shippingCost.toFixed(2),
            }] : []),
        ],
    };

    return new Promise((resolve, reject) => {
        iyzico.payment.create(request, async (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.status !== 'success') {
                return reject(new Error(result.errorMessage || 'Ödeme başarısız'));
            }

            // Ödeme başarılı
            order.iyzicoPaymentId = result.paymentId;
            order.status = 'Processing';
            order.paymentStatus = 'Success';
            await order.save();

            // Send success emails
            await sendOrderSuccessEmails(order._id);

            resolve(result);
        });
    });
};

export const verifyPayment = async (token) => {
    if (iyzico._disabled) {
        throw createHttpError(503, 'Payment service is currently unavailable.');
    }
    return new Promise((resolve, reject) => {
        iyzico.checkoutForm.retrieve({
            locale: 'tr',
            token: token
        }, async (err, result) => {
            if (err) return reject(err);

            if (result.status !== 'success') {
                return reject(new Error(result.errorMessage));
            }

            if (result.paymentStatus !== 'SUCCESS') {
                return resolve({ success: false });
            }

            const order = await OrdersCollection.findOne({ iyzicoToken: token });
            if (!order) return resolve({ success: false, error: 'Order not found' });

            order.status = 'Processing'; // or 'Paid'
            order.paymentStatus = 'Success';
            order.iyzicoPaymentId = result.paymentId;
            await order.save();

            // Send Emails
            await sendOrderSuccessEmails(order._id);

            resolve({ success: true, orderId: order._id });
        });
    });
};
