import { Router } from 'express';
import EventController from '../controllers/event.controller';
import authMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createEventSchema, idSchema } from '../validation/event.validation';

const router = Router();

router.post(
  '/create',
  authMiddleware,
  validate(createEventSchema),
  EventController.create,
);
router.get('/', authMiddleware, EventController.listAll);
router.get('/:id', authMiddleware, EventController.getOne);
router.post('/update/:id', authMiddleware, EventController.update);
router.post('/delete/:id', authMiddleware, EventController.delete);
router.post(
  '/subscribe/:eventId',
  authMiddleware,
  validate(idSchema),
  EventController.subscribe,
);
router.post(
  '/unsubscribe/:eventId',
  authMiddleware,
  validate(idSchema),
  EventController.unsubscribe,
);

export default router;
