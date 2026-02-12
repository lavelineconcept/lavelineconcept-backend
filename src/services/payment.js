import iyzico from '../utils/iyzico.js';
import { OrdersCollection } from '../db/models/order.js';
import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import { sendOrderSuccessEmails } from './mailService.js';

export const processPayment = async (order, user, ip, cardDetails) => {
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
        basketItems: order.items.map((item) => ({
            id: item.productId.toString(),
            name: 'Product', // Ürün adını buraya taşımak iyi olur
            category1: 'General',
            itemType: 'PHYSICAL',
            price: item.price.toFixed(2),
        })),
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

            // Success e-postalarını gönder
            sendOrderSuccessEmails(order._id);

            resolve(result);
        });
    });
};

export const verifyPayment = async (token) => {
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

            // Send Emails (Best effort, don't await blocking response if speed needed, but here usually fine)
            // Using setImmediate or not awaiting to prevent blocking response? 
            // For safety and to keep response fast, we can not await it, or handle it in background.
            // But usually Node handles async well. Let's just call it without awaiting to return response faster.
            sendOrderSuccessEmails(order._id);

            resolve({ success: true, orderId: order._id });
        });
    });
};
