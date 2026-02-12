import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
    getCategoriesController,
    createCategoryController,
    updateCategoryController,
    deleteCategoryController,
} from '../controllers/categories.js';
import { upload } from '../utils/upload.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import validateBody from '../middlewares/validateBody.js';
import { createCategorySchema, updateCategorySchema } from '../validation/categories.js';
import { isValidId } from '../middlewares/isValidId.js';

const categoriesRouter = Router();

categoriesRouter.get('/', ctrlWrapper(getCategoriesController));

categoriesRouter.post(
    '/',
    authenticate,
    checkRoles('admin'),
    upload.single('image'),
    validateBody(createCategorySchema),
    ctrlWrapper(createCategoryController),
);

categoriesRouter.patch(
    '/:categoryId',
    isValidId,
    authenticate,
    checkRoles('admin'),
    upload.single('image'),
    validateBody(updateCategorySchema),
    ctrlWrapper(updateCategoryController),
);

categoriesRouter.delete(
    '/:categoryId',
    isValidId,
    authenticate,
    checkRoles('admin'),
    ctrlWrapper(deleteCategoryController),
);

export default categoriesRouter;
