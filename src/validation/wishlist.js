import Joi from 'joi';
import { VALIDATION_RULES } from '../constants/index.js';

export const addToWishlistSchema = Joi.object({
    productId: Joi.string().hex().length(VALIDATION_RULES.MONGO_ID_LENGTH).required(),
});
