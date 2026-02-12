import Joi from 'joi';
import { CART_DEFAULTS } from '../constants/index.js';

export const addToCartSchema = Joi.object({
    productId: Joi.string().hex().length(24).required(),
    quantity: Joi.number().integer().min(CART_DEFAULTS.MIN_QUANTITY).default(CART_DEFAULTS.DEFAULT_QUANTITY),
    selectedAttributes: Joi.object().pattern(Joi.string(), Joi.string()).default({}),
});

export const updateCartItemSchema = Joi.object({
    quantity: Joi.number().integer().min(CART_DEFAULTS.MIN_QUANTITY).required(),
});
