import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

interface myTokenPayload extends jwt.JwtPayload {
  id: string;
}

const authMiddleware: RequestHandler = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    res.status(401).json({ error: 'Access denied. Token not found.' });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'secretKey',
    ) as myTokenPayload;
    req.userId = decoded.id;
    next();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: error.message });
      return;
    }
    res.status(401).json({ error: 'Invalid or expired token.' });
    return;
  }
};

export default authMiddleware;
