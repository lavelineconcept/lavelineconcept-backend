import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { addToWishlistSchema } from '../validation/wishlist.js';
import {
    getWishlistController,
    addToWishlistController,
    removeFromWishlistController,
} from '../controllers/wishlist.js';

const wishlistRouter = Router();

wishlistRouter.use(authenticate);

wishlistRouter.get('/', ctrlWrapper(getWishlistController));

wishlistRouter.post(
    '/',
    validateBody(addToWishlistSchema),
    ctrlWrapper(addToWishlistController),
);

wishlistRouter.delete(
    '/:productId',
    isValidId,
    ctrlWrapper(removeFromWishlistController),
);

export default wishlistRouter;
