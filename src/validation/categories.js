import Joi from 'joi';
import { VALIDATION_RULES } from '../constants/index.js';

export const createCategorySchema = Joi.object({
    name: Joi.string()
        .min(VALIDATION_RULES.CATEGORY_NAME.MIN)
        .max(VALIDATION_RULES.CATEGORY_NAME.MAX)
        .required(),
    slug: Joi.string()
        .min(VALIDATION_RULES.CATEGORY_SLUG.MIN)
        .max(VALIDATION_RULES.CATEGORY_SLUG.MAX)
        .required(),
    parentId: Joi.string().hex().length(VALIDATION_RULES.MONGO_ID_LENGTH),
});

export const updateCategorySchema = Joi.object({
    name: Joi.string()
        .min(VALIDATION_RULES.CATEGORY_NAME.MIN)
        .max(VALIDATION_RULES.CATEGORY_NAME.MAX),
    slug: Joi.string()
        .min(VALIDATION_RULES.CATEGORY_SLUG.MIN)
        .max(VALIDATION_RULES.CATEGORY_SLUG.MAX),
    parentId: Joi.string().hex().length(VALIDATION_RULES.MONGO_ID_LENGTH).allow(null),
});
