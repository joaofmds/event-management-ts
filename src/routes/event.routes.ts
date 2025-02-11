import { Router } from 'express';
import EventController from '../controllers/event.controller';
import authMiddleware from '../middlewares/auth.middleware';

const router = Router();

router.post('/create', authMiddleware, EventController.create);
router.get('/', authMiddleware, EventController.listAll);
router.get('/:id', authMiddleware, EventController.getOne);
router.post('/update/:id', authMiddleware, EventController.update);
router.post('/delete/:id', authMiddleware, EventController.delete);
router.post('/subscribe/:eventId', authMiddleware, EventController.subscribe);
router.post(
  '/unsubscribe/:eventId',
  authMiddleware,
  EventController.unsubscribe,
);

export default router;
