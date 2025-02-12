import Joi from 'joi';

export const registerUserSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email(),
  password: Joi.string()
    .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
    .regex(/[0-9a-zA-Z]*[a-zA-Z][0-9a-zA-Z]*/)
    .min(8)
    .required(),
});

export const loginUserSchema = Joi.object({
  email: Joi.string().email(),
  password: Joi.string()
    .regex(/[0-9a-zA-Z]*\d[0-9a-zA-Z]*/)
    .regex(/[0-9a-zA-Z]*[a-zA-Z][0-9a-zA-Z]*/)
    .min(8)
    .required(),
});
