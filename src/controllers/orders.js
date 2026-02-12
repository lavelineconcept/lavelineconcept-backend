import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
} from '../services/orders.js';
import { verifyPayment } from '../services/payment.js';
import { env } from '../utils/env.js';

export const createOrderController = async (req, res) => {
    const userId = req.user._id;
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    const result = await createOrder(userId, { ...req.body, ip });

    res.status(201).json({
        status: 201,
        message: 'Order created successfully',
        data: result,
    });
};

export const paymentCallbackController = async (req, res) => {
    const { token } = req.body;

    try {
        const result = await verifyPayment(token);

        const clientUrl = env('CLIENT_URL', 'http://localhost:5173');

        if (result.success) {
            return res.redirect(`${clientUrl}/payment/success?orderId=${result.orderId}`);
        } else {
            return res.redirect(`${clientUrl}/payment/failed?error=${result.error || 'Payment Failed'}`);
        }
    } catch (err) {
        const clientUrl = env('CLIENT_URL', 'http://localhost:5173');
        return res.redirect(`${clientUrl}/payment/failed?error=${err.message}`);
    }
};

export const getUserOrdersController = async (req, res) => {
    const userId = req.user._id;
    const orders = await getUserOrders(userId);

    res.json({
        status: 200,
        message: 'User orders retrieved successfully',
        data: orders,
    });
};

export const getOrderByIdController = async (req, res) => {
    const { orderId } = req.params;
    const order = await getOrderById(orderId);

    res.json({
        status: 200,
        message: 'Order details retrieved successfully',
        data: order,
    });
};

export const updateOrderStatusController = async (req, res) => {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await updateOrderStatus(orderId, status);

    res.json({
        status: 200,
        message: 'Order status updated successfully',
        data: order,
    });
};
