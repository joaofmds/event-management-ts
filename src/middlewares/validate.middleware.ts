import { Request, Response, NextFunction } from 'express';
import { ObjectSchema } from 'joi';

/**
 * @param schema
 */

export const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: false,
    });

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      res.status(400).json({ error: errorMessages });
      return;
    }

    req.body = value;
    next();
  };
};
