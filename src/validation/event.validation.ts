import Joi from 'joi';

export const createEventSchema = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).required(),
  date: Joi.date().iso().required(),
  local: Joi.string().min(3),
});

export const userIdSchema = Joi.object({
  userId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});

export const eventIdSchema = Joi.object({
  eventId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
});
