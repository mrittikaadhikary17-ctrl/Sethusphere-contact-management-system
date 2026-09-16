import { Router } from 'express';
import { createResourceController } from '../controllers/resourceController.js';
import {
  Contact,
  DuplicateRecord,
  Group,
  Interaction,
  Notification,
  Tag,
  Task,
} from '../models/index.js';
import { requireAuth } from '../middleware/auth.js';

const makeRouter = (Model, ownerField = 'ownerId') => {
  const router = Router();
  const controller = createResourceController(Model, ownerField);
  router.use(requireAuth);
  router.route('/').get(controller.list).post(controller.create);
  router.route('/:id').get(controller.get).patch(controller.update).delete(controller.remove);
  return router;
};

export const contactRoutes = makeRouter(Contact);
export const interactionRoutes = makeRouter(Interaction);
export const taskRoutes = makeRouter(Task);
export const groupRoutes = makeRouter(Group);
export const tagRoutes = makeRouter(Tag);
export const duplicateRoutes = makeRouter(DuplicateRecord);
export const notificationRoutes = makeRouter(Notification, 'userId');

export const relationshipRoutes = Router();
relationshipRoutes.use(requireAuth);
relationshipRoutes.get('/', async (req, res, next) => {
  try {
    const contacts = await Contact.find(
      { ownerId: req.userId, deletedAt: null },
      {
        firstName: 1,
        lastName: 1,
        fullName: 1,
        company: 1,
        relationshipScore: 1,
        relationshipStatus: 1,
        healthStatus: 1,
        lastInteractionDate: 1,
        nextFollowUpDate: 1,
      }
    ).sort({ relationshipScore: -1 });
    res.json({ data: contacts });
  } catch (error) {
    next(error);
  }
});
