import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { UPLOAD_LIMITS } from '../constants/index.js';
import {
    getProductsController,
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
} from '../controllers/products.js';
import { upload } from '../utils/upload.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import validateBody from '../middlewares/validateBody.js';
import { createProductSchema, updateProductSchema } from '../validation/products.js';
import { isValidId } from '../middlewares/isValidId.js';

const productsRouter = Router();

productsRouter.get('/', ctrlWrapper(getProductsController));

productsRouter.get('/:productId', isValidId, ctrlWrapper(getProductByIdController));

productsRouter.post(
    '/',
    authenticate,
    checkRoles('admin'),
    upload.array('images', UPLOAD_LIMITS.MAX_COUNT),
    validateBody(createProductSchema),
    ctrlWrapper(createProductController),
);

productsRouter.patch(
    '/:productId',
    authenticate,
    isValidId,
    checkRoles('admin'),
    upload.array('images', UPLOAD_LIMITS.MAX_COUNT),
    validateBody(updateProductSchema),
    ctrlWrapper(updateProductController),
);

productsRouter.delete(
    '/:productId',
    authenticate,
    isValidId,
    checkRoles('admin'),
    ctrlWrapper(deleteProductController),
);

export default productsRouter;
