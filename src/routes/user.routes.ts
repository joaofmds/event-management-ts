import { Router } from 'express';
import userController from '../controllers/user.controller';
import { validateBody } from '../middlewares/validate.middleware';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validation/user.validation';

const router = Router();

router.post(
  '/register',
  validateBody(registerUserSchema),
  userController.register,
);
router.post('/login', validateBody(loginUserSchema), userController.login);

export default router;
