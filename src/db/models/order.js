import { model, Schema } from 'mongoose';
import { ORDER_STATUS, PAYMENT_METHODS } from '../../constants/index.js';

const orderSchema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'users', required: true },
        items: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'products', required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true }, // Price at time of purchase
            },
        ],
        totalPrice: { type: Number, required: true },
        status: {
            type: String,
            enum: Object.values(ORDER_STATUS),
            default: ORDER_STATUS.PENDING,
        },
        paymentMethod: {
            type: String,
            enum: Object.values(PAYMENT_METHODS),
            required: true,
        },
        paymentStatus: { type: String, enum: ['Pending', 'Success', 'Failed'], default: 'Pending' },
        isGiftWrap: { type: Boolean, default: false },
        iyzicoToken: { type: String },
        iyzicoPaymentId: { type: String },
        ipAddress: { type: String },
        address: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            zip: { type: String, required: true },
            country: { type: String, required: true },
        },
        contactNumber: { type: String, required: true },
    },
    { timestamps: true, versionKey: false },
);

export const OrdersCollection = model('orders', orderSchema);
