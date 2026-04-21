import iyzico from '../utils/iyzico.js';
import { OrdersCollection } from '../db/models/order.js';
import { ProductsCollection } from '../db/models/product.js';
import { CartsCollection } from '../db/models/cart.js';
import createHttpError from 'http-errors';
import { env } from '../utils/env.js';
import { sendOrderSuccessEmails } from './mailService.js';

export const processPayment = async (order, user, ip, cardDetails) => {
    if (iyzico._disabled) {
        throw createHttpError(503, 'Payment service is currently unavailable.');
    }

    const callbackUrl = `${env('APP_DOMAIN', 'http://localhost:3000')}/api/orders/checkout/callback/3d`;

    const request = {
        locale: 'tr',
        conversationId: order._id.toString(),
        price: order.totalPrice.toFixed(2),
        paidPrice: order.totalPrice.toFixed(2),
        currency: 'TRY',
        basketId: order._id.toString(),
        paymentGroup: 'PRODUCT',
        paymentChannel: 'WEB',
        callbackUrl: callbackUrl, // Required for 3D
        paymentCard: {
            cardHolderName: cardDetails.cardHolderName,
            cardNumber: cardDetails.cardNumber,
            expireMonth: cardDetails.expireMonth,
            expireYear: cardDetails.expireYear,
            cvc: cardDetails.cvc,
            registerCard: '0'
        },
        buyer: {
            id: user._id.toString(),
            name: user.name,
            surname: user.surname || user.name,
            gsmNumber: order.contactNumber || user.telephone || '+905555555555',
            email: user.email,
            identityNumber: '11111111111',
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

    // We use ThreedsInitialize because many cards/merchants now require 3D Secure
    return new Promise((resolve, reject) => {
        iyzico.threedsInitialize.create(request, async (err, result) => {
            if (err) {
                return reject(err);
            }

            if (result.status !== 'success') {
                return reject(new Error(result.errorMessage || '3D Secure başlatılamadı'));
            }

            // Return the HTML content for 3D Secure redirect
            resolve({
                isThreeDS: true,
                htmlContent: result.threeDSHtmlContent
            });
        });
    });
};

export const completeThreedsPayment = async (payload) => {
    const { paymentId, conversationId } = payload;

    const request = {
        locale: 'tr',
        conversationId: conversationId,
        paymentId: paymentId
    };

    return new Promise((resolve, reject) => {
        iyzico.threedsPayment.create(request, async (err, result) => {
            if (err) return reject(err);

            if (result.status !== 'success') {
                return reject(new Error(result.errorMessage || 'Ödeme tamamlanamadı'));
            }

            const order = await OrdersCollection.findById(conversationId);
            if (!order) return reject(new Error('Sipariş bulunamadı'));

            order.iyzicoPaymentId = result.paymentId;
            order.status = 'Processing';
            order.paymentStatus = 'Success';
            await order.save();

            // Deduct Stock
            for (const item of order.items) {
                await ProductsCollection.findByIdAndUpdate(item.productId, {
                    $inc: { stock: -item.quantity },
                });
            }

            // Clear User Cart
            await CartsCollection.findOneAndUpdate(
                { userId: order.userId },
                { $set: { items: [] } }
            );

            // Send success emails
            await sendOrderSuccessEmails(order._id);

            resolve({ success: true, orderId: order._id });
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
