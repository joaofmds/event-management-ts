import { Router } from 'express';
import EventController from '../controllers/event.controller';
import authMiddleware from '../middlewares/auth.middleware';
import {
  validateBody,
  validateParams,
} from '../middlewares/validate.middleware';
import {
  createEventSchema,
  eventIdSchema,
  userIdSchema,
} from '../validation/event.validation';

const router = Router();

router.post(
  '/create',
  authMiddleware,
  validateBody(createEventSchema),
  EventController.create,
);

router.get('/', authMiddleware, EventController.listAll);

router.get(
  '/:eventId',
  authMiddleware,
  validateParams(eventIdSchema),
  EventController.getOne,
);

router.post(
  '/update/:eventId',
  authMiddleware,
  validateParams(eventIdSchema),
  EventController.update,
);

router.post(
  '/delete/:eventId',
  authMiddleware,
  validateParams(eventIdSchema),
  EventController.delete,
);

router.post(
  '/subscribe/:eventId',
  authMiddleware,
  validateParams(eventIdSchema),
  validateBody(userIdSchema),
  EventController.subscribe,
);

router.post(
  '/unsubscribe/:eventId',
  authMiddleware,
  validateParams(eventIdSchema),
  validateBody(userIdSchema),
  EventController.unsubscribe,
);

export default router;
