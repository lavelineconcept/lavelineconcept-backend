import { Router } from 'express';
import categoriesRouter from './categories.js';
import cartRouter from './cart.js';
import authRouter from './auth.js';
import productsRouter from './products.js';
import wishlistRouter from './wishlist.js';

import ordersRouter from './orders.js';

const router = Router();

router.use('/auth', authRouter);
router.use('/categories', categoriesRouter);
router.use('/products', productsRouter);
router.use('/cart', cartRouter);
router.use('/wishlist', wishlistRouter);
router.use('/orders', ordersRouter);

export default router;
