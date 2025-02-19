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
      const { page = 1, limit = 10, sort, ...filters } = req.query;

      const query: Record<string, unknown> = {};
      for (const key in filters) {
        query[key] = { $regex: filters[key] as string, $options: 'i' };
      }

      const skip = (Number(page) - 1) * Number(limit);

      let queryExec = EventModel.find(query).skip(skip).limit(Number(limit));

      if (sort) {
        const [sortField, sortOrder] = (sort as string).split(':');
        queryExec = queryExec.sort({
          [sortField]: sortOrder === 'desc' ? -1 : 1,
        });
      }

      const events = await queryExec.exec();

      const total = await EventModel.countDocuments(query);

      res.status(200).json({ total, events });
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
      const { eventId } = req.params;
      const event = await EventModel.findById(eventId).populate(
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
      const { eventId } = req.params;
      const updated = await EventModel.findByIdAndUpdate(eventId, req.body, {
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
      const { eventId } = req.params;
      const deleted = await EventModel.findByIdAndDelete(eventId);

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

  public updateBanner = async (eventId: string, imagePath: string) => {
    const updated = await EventModel.findByIdAndUpdate(eventId, {
      banner: imagePath,
    });
    return updated;
  };

  public uploadBanner: RequestHandler = async (req, res) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded.' });
        return;
      }

      const eventId = req.params.id;
      const imagePath = `/uploads/${req.file.filename}`;

      const updatedEvent = await this.updateBanner(eventId, imagePath);

      res
        .status(200)
        .json({ message: 'Banner uploaded successfully', event: updatedEvent });
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
