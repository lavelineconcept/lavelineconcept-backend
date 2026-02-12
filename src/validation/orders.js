import Joi from 'joi';
import { PAYMENT_METHODS, ORDER_STATUS } from '../constants/index.js';

export const createOrderSchema = Joi.object({
    paymentMethod: Joi.string()
        .valid(...Object.values(PAYMENT_METHODS))
        .required(),
    address: Joi.object({
        street: Joi.string().required(),
        city: Joi.string().required(),
        zip: Joi.string().required(),
        country: Joi.string().required(),
    }).required(),
    contactNumber: Joi.string().required(),
    isGiftWrap: Joi.boolean().optional(),
    cardDetails: Joi.object({
        cardHolderName: Joi.string().required(),
        cardNumber: Joi.string().required(),
        expireMonth: Joi.string().required(),
        expireYear: Joi.string().required(),
        cvc: Joi.string().required(),
    }).optional(),
});

export const updateOrderStatusSchema = Joi.object({
    status: Joi.string()
        .valid(...Object.values(ORDER_STATUS))
        .required(),
});
