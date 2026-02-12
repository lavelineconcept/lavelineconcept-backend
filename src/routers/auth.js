import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { registerUserSchema, loginUserSchema } from '../validation/auth.js';
import {
  registerUserController,
  loginUserController,
} from '../controllers/auth.js';
import validateBody from '../middlewares/validateBody.js';
import { logoutUserController } from '../controllers/auth.js';
import { refreshUserSessionController } from '../controllers/auth.js';
import { sendResetEmailSchema } from '../validation/auth.js';
import { sendResetEmailController } from '../controllers/auth.js';
import { resetPasswordSchema } from '../validation/auth.js';
import { resetPasswordController } from '../controllers/auth.js';
import { updateUserSchema } from '../validation/auth.js';
import { updateUserController } from '../controllers/auth.js';

const authRouter = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, // 20 requests per 15 minutes
  message: {
    status: 429,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

authRouter.post(
  '/register',
  authLimiter,
  validateBody(registerUserSchema),
  ctrlWrapper(registerUserController),
);
authRouter.post(
  '/login',
  authLimiter,
  validateBody(loginUserSchema),
  ctrlWrapper(loginUserController),
);
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
authRouter.post(
  '/send-reset-email',
  authLimiter,
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmailController),
);
authRouter.post(
  '/reset-password',
  authLimiter,
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPasswordController),
);
authRouter.patch(
  '/update-user/:id',
  validateBody(updateUserSchema),
  ctrlWrapper(updateUserController),
);

export default authRouter;
