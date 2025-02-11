import { RequestHandler } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model';

class UserController {
  public register: RequestHandler = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      const userEmail = await UserModel.findOne({ email });

      if (userEmail) {
        res.status(401).json({ error: 'Email already registered.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await UserModel.create({
        name,
        email,
        password: hashedPassword,
      });

      res.status(201).json(newUser);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      } else {
        res.status(500).json({ error: 'Unknown error' });
        return;
      }
    }
  };

  public login: RequestHandler = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await UserModel.findOne({ email });

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET || 'secretKey',
        {
          expiresIn: '1d',
        },
      );

      res.status(200).json({ user, token });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };

  public getAllUsers: RequestHandler = async (req, res) => {
    try {
      const users = await UserModel.find();

      res.status(200).json({ users });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }
      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };
}

export default new UserController();
