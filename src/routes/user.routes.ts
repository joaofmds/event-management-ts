import { Router } from 'express';
import userController from '../controllers/user.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  loginUserSchema,
  registerUserSchema,
} from '../validation/user.validation';

const router = Router();

router.post('/register', validate(registerUserSchema), userController.register);
router.post('/login', validate(loginUserSchema), userController.login);

export default router;
