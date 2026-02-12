import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { authenticate } from '../middlewares/authenticate.js';
import validateBody from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { createOrderSchema, updateOrderStatusSchema } from '../validation/orders.js';
import {
    createOrderController,
    getUserOrdersController,
    getOrderByIdController,
    updateOrderStatusController,
} from '../controllers/orders.js';

const ordersRouter = Router();

ordersRouter.use(authenticate);

ordersRouter.post(
    '/',
    validateBody(createOrderSchema),
    ctrlWrapper(createOrderController),
);

ordersRouter.get('/', ctrlWrapper(getUserOrdersController));

ordersRouter.get('/:orderId', isValidId, ctrlWrapper(getOrderByIdController));

ordersRouter.patch(
    '/:orderId/status',
    isValidId,
    checkRoles('admin'),
    validateBody(updateOrderStatusSchema),
    ctrlWrapper(updateOrderStatusController),
);

export default ordersRouter;
