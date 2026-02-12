import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { addToCartSchema, updateCartItemSchema } from '../validation/cart.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
    getCartController,
    addToCartController,
    updateCartItemController,
    updateCartGiftWrapController,
    removeCartItemController,
    clearCartController,
} from '../controllers/cart.js';

const cartRouter = Router();

// All cart routes require authentication
cartRouter.use(authenticate);

cartRouter.get('/', ctrlWrapper(getCartController));
cartRouter.post(
    '/',
    validateBody(addToCartSchema),
    ctrlWrapper(addToCartController),
);
cartRouter.patch(
    '/gift-wrap',
    ctrlWrapper(updateCartGiftWrapController),
);

cartRouter.patch(
    '/:itemId',
    isValidId,
    validateBody(updateCartItemSchema),
    ctrlWrapper(updateCartItemController),
);
cartRouter.delete('/:itemId', isValidId, ctrlWrapper(removeCartItemController));
cartRouter.delete('/', ctrlWrapper(clearCartController));

export default cartRouter;
