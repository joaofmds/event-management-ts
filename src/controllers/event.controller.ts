import { RequestHandler } from 'express';
import EventModel from '../models/event.model';
import UserModel from '../models/user.model';

class EventController {
  public create: RequestHandler = async (req, res) => {
    try {
      const { title, description, date, local } = req.body;
      const newEvent = await EventModel.create({
        title,
        description,
        date,
        local,
      });

      res.status(201).json(newEvent);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };

  public listAll: RequestHandler = async (req, res) => {
    try {
      const events = await EventModel.find().populate(
        'participants',
        'name email',
      );
      res.status(200).json(events);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };

  public getOne: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const event = await EventModel.findById(id).populate(
        'participants',
        'name email',
      );

      if (!event) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      res.status(200).json(event);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };

  public update: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await EventModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (!updated) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      res.status(200).json({ updated, message: 'Event updated successfully.' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };

  public delete: RequestHandler = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await EventModel.findByIdAndDelete(id);

      if (!deleted) {
        res.status(404).json({ error: 'Event not found' });
        return;
      }

      res.json({ message: 'Event deleted successfully.' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };

  public subscribe: RequestHandler = async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.body.userId;

      const event = await EventModel.findById(eventId);
      if (!event) {
        res.status(404).json({ error: 'Event not found.' });
        return;
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      if (event.participants.includes(userId)) {
        res.status(400).json({ error: 'User already subscribed.' });
        return;
      }

      event.participants.push(userId);
      await event.save();

      res.status(201).json({ message: 'Subscribe completed successfully.' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(400).json({ error: error.message });
        return;
      }

      res.status(500).json({ error: 'Unknown error' });
      return;
    }
  };

  public unsubscribe: RequestHandler = async (req, res) => {
    try {
      const { eventId } = req.params;
      const userId = req.body.userId;

      const event = await EventModel.findById(eventId);
      if (!event) {
        res.status(404).json({ error: 'Event not found.' });
        return;
      }

      const user = await UserModel.findById(userId);

      if (!user) {
        res.status(404).json({ error: 'User not found.' });
        return;
      }

      if (!event.participants.includes(userId)) {
        res.status(404).json({ error: 'User is not subscribed.' });
        return;
      }

      event.participants = event.participants.filter(
        (participantId) => participantId.toString() !== userId.toString(),
      );

      await event.save();

      res.status(200).json({ message: 'Unsubscribe completed successfully.' });
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

export default new EventController();
