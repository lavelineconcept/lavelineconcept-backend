import Joi from 'joi';
import { VALIDATION_RULES } from '../constants/index.js';

export const createProductSchema = Joi.object({
    title: Joi.string()
        .min(VALIDATION_RULES.PRODUCT_TITLE.MIN)
        .max(VALIDATION_RULES.PRODUCT_TITLE.MAX)
        .required(),
    description: Joi.string()
        .min(VALIDATION_RULES.PRODUCT_DESCRIPTION.MIN)
        .required(),
    price: Joi.number().min(0).required(),
    stock: Joi.number().min(0).default(0),
    brand: Joi.string().max(VALIDATION_RULES.PRODUCT_BRAND.MAX),
    categoryId: Joi.string().hex().length(VALIDATION_RULES.MONGO_ID_LENGTH).required(),
    images: Joi.array().items(Joi.string()).single(),
    attributes: Joi.object().pattern(Joi.string(), Joi.string()), // e.g., { "Size": "M" }
});

export const updateProductSchema = Joi.object({
    title: Joi.string()
        .min(VALIDATION_RULES.PRODUCT_TITLE.MIN)
        .max(VALIDATION_RULES.PRODUCT_TITLE.MAX),
    description: Joi.string().min(VALIDATION_RULES.PRODUCT_DESCRIPTION.MIN),
    price: Joi.number().min(0),
    stock: Joi.number().min(0),
    brand: Joi.string().max(VALIDATION_RULES.PRODUCT_BRAND.MAX),
    categoryId: Joi.string().hex().length(VALIDATION_RULES.MONGO_ID_LENGTH),
    images: Joi.array().items(Joi.string()).single(),
    attributes: Joi.object().pattern(Joi.string(), Joi.string()),
});
