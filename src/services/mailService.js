import fs from 'node:fs/promises';
import path from 'node:path';
import { sendEmail } from '../utils/sendMail.js';
import { UsersCollection } from '../db/models/user.js';
import { ProductsCollection } from '../db/models/product.js';
import { OrdersCollection } from '../db/models/order.js';

const TEMPLATES_DIR = path.resolve('src', 'templates');

export const sendOrderSuccessEmails = async (orderId) => {
    try {
        const order = await OrdersCollection.findById(orderId).lean();
        if (!order) {
            console.error(`Order not found for email: ${orderId}`);
            return;
        }

        const user = await UsersCollection.findById(order.userId).lean();
        if (!user) {
            console.error(`User not found for order email: ${orderId}`);
            return;
        }

        // Fetch product details for names
        const productIds = order.items.map(item => item.productId);
        const products = await ProductsCollection.find({ _id: { $in: productIds } }).lean();
        const productMap = {};
        products.forEach(p => productMap[p._id.toString()] = p);

        // Prepare Template Data
        const userName = `${user.name} ${user.surname}`;
        const userEmail = user.email;
        const userPhone = user.telephone || order.contactNumber; // Fallback to order contact
        const address = `${order.address.street}, ${order.address.city}, ${order.address.district || ''}, ${order.address.country}`;
        const totalPrice = order.totalPrice.toFixed(2);
        const paymentStatus = order.paymentStatus;
        const oId = order._id.toString();

        // Generate Product Rows HTML
        const productRows = order.items.map(item => {
            const product = productMap[item.productId.toString()];
            const title = product ? product.title : 'Deleted Product';
            return `
                <tr>
                    <td>${title}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toFixed(2)} ₺</td>
                </tr>
            `;
        }).join('');

        // 1. Send Admin Email
        const adminTemplatePath = path.join(TEMPLATES_DIR, 'admin-order-notification.html');
        let adminHtml = await fs.readFile(adminTemplatePath, 'utf-8');

        adminHtml = adminHtml
            .replace('{{orderId}}', oId)
            .replace('{{userName}}', userName)
            .replace('{{userEmail}}', userEmail)
            .replace('{{userPhone}}', userPhone)
            .replace('{{address}}', address)
            .replace('{{productRows}}', productRows)
            .replace('{{totalPrice}}', totalPrice)
            .replace('{{paymentStatus}}', paymentStatus);

        await sendEmail({
            from: process.env.SMTP_FROM,
            to: 'lavelineconcept@gmail.com', // Admin email
            subject: `Yeni Sipariş: #${oId}`,
            html: adminHtml,
        });

        // 2. Send Customer Email
        const customerTemplatePath = path.join(TEMPLATES_DIR, 'customer-order-notification.html');
        let customerHtml = await fs.readFile(customerTemplatePath, 'utf-8');

        customerHtml = customerHtml
            .replace('{{userName}}', userName)
            .replace('{{orderId}}', oId)
            .replace('{{productRows}}', productRows)
            .replace('{{totalPrice}}', totalPrice);

        await sendEmail({
            from: process.env.SMTP_FROM,
            to: userEmail,
            subject: 'Siparişiniz Alındı - Laveline Concept',
            html: customerHtml,
        });

        console.log(`Order emails sent for order #${oId}`);

    } catch (error) {
        console.error('Error sending order emails:', error);
        // Don't throw, just log. Email failure shouldn't crash the payment process if possible, 
        // strictly speaking it depends on business logic but usually it's a side effect.
    }
};
