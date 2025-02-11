import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/server';
import EventModel from '../../src/models/event.model';

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await EventModel.deleteMany({});
});

const resgisterAndLoginUser = async () => {
  const newUser = {
    name: 'Fulano',
    email: 'fulano@gmail.com',
    password: 'senha123',
  };

  await request(app).post('/users/register').send(newUser);

  const loginResponse = await request(app)
    .post('/users/login')
    .send({ email: newUser.email, password: newUser.password });

  return loginResponse.body;
};

const createTestEvent = async (
  title: string,
  description: string,
  date: string,
  local: string,
  token: string,
) => {
  const newEvent = {
    title: title,
    description: description,
    date: date,
    local: local,
  };

  const response = await request(app)
    .post('/events/create')
    .set('Authorization', `Bearer ${token}`)
    .send(newEvent);

  return response;
};

describe('POST /events/create', () => {
  it('Should create a event successfully', async () => {
    const user = await resgisterAndLoginUser();
    const response = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    expect(response.status).toBe(201);
    expect(response.body.title).toBe('Test');
    expect(response.body.description).toBe('Testing testing testing');
    expect(response.body.date).toBe('2025-02-06T00:00:00.000Z');
    expect(response.body.local).toBe('Brasília/BR');
  });
});

describe('GET /events', () => {
  it('Should list all events successfully', async () => {
    const user = await resgisterAndLoginUser();
    const response = await request(app)
      .get('/events')
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(200);
  });
});

describe('GET /events/:id', () => {
  it('Should list an event by ID', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const { _id: eventId } = createdEvent.body;

    const response = await request(app)
      .get(`/events/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('_id', eventId);
  });

  it('Should return 404 if a event was not found', async () => {
    const user = await resgisterAndLoginUser();

    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const response = await request(app)
      .get(`/events/${nonExistentId}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'Event not found');
  });
});

describe('POST /events/update/:id', () => {
  it('Should update a event successfully', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const { _id: eventID } = createdEvent.body;

    const updatedEvent = {
      title: 'Updated title',
      description: 'Updated description',
      date: '2025-02-08',
      local: 'São Paulo/BR',
    };

    const response = await request(app)
      .post(`/events/update/${eventID}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedEvent);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event updated successfully.');
    expect(response.body.updated.title).toBe('Updated title');
    expect(response.body.updated.description).toBe('Updated description');
    expect(response.body.updated.date).toBe('2025-02-08T00:00:00.000Z');
    expect(response.body.updated.local).toBe('São Paulo/BR');
  });

  it('Should return 404 if a event was not found', async () => {
    const user = await resgisterAndLoginUser();

    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const updatedEvent = {
      title: 'Updated title',
      description: 'Updated description',
      date: '2025-02-08',
      local: 'São Paulo/BR',
    };

    const response = await request(app)
      .post(`/events/update/${nonExistentId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send(updatedEvent);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Event not found');
  });
});

describe('POST /events/delete/:id', () => {
  it('Should delete a event successfully', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const { _id: eventId } = createdEvent.body;

    const response = await request(app)
      .post(`/events/delete/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Event deleted successfully.');
  });

  it('Should return 404 if a event was not found', async () => {
    const user = await resgisterAndLoginUser();
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .post(`/events/delete/${nonExistentId}`)
      .set('Authorization', `Bearer ${user.token}`);

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Event not found');
  });
});

describe('POST /events/subscribe/:id', () => {
  it('Should subscribe a user in a event successfully', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const eventId = createdEvent.body._id;
    const userId = user.user._id;

    const response = await request(app)
      .post(`/events/subscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Subscribe completed successfully.');
  });

  it('Should return 404 if a event was not found', async () => {
    const user = await resgisterAndLoginUser();
    const nonExistentId = new mongoose.Types.ObjectId().toString();
    const userId = user.user._id;

    const response = await request(app)
      .post(`/events/subscribe/${nonExistentId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Event not found.');
  });

  it('Should return 404 if a user was not found', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const eventId = createdEvent.body._id;
    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .post(`/events/subscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: nonExistentId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found.');
  });

  it('Should return 400 if a user was already subscribed', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const eventId = createdEvent.body._id;
    const userId = user.user._id;

    await request(app)
      .post(`/events/subscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    const response = await request(app)
      .post(`/events/subscribe/${createdEvent.body._id}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe('User already subscribed.');
  });
});

describe('POST /events/unsubscribe/:id', () => {
  it('Should unsubscribe a user in a event successfully', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const eventId = createdEvent.body._id;
    const userId = user.user._id;

    await request(app)
      .post(`/events/subscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    const response = await request(app)
      .post(`/events/unsubscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Unsubscribe completed successfully.');
  });

  it('Should return 404 if a event was not found', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const eventId = createdEvent.body._id;
    const userId = user.user._id;

    await request(app)
      .post(`/events/subscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .post(`/events/unsubscribe/${nonExistentId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('Event not found.');
  });

  it('Should return 404 if a user was not found', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const eventId = createdEvent.body._id;
    const userId = user.user._id;

    await request(app)
      .post(`/events/subscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    const nonExistentId = new mongoose.Types.ObjectId().toString();

    const response = await request(app)
      .post(`/events/unsubscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: nonExistentId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User not found.');
  });

  it('Should return 404 if a user was not subscribed', async () => {
    const user = await resgisterAndLoginUser();
    const createdEvent = await createTestEvent(
      'Test',
      'Testing testing testing',
      '2025-02-06',
      'Brasília/BR',
      user.token,
    );

    const eventId = createdEvent.body._id;
    const userId = user.user._id;

    const response = await request(app)
      .post(`/events/unsubscribe/${eventId}`)
      .set('Authorization', `Bearer ${user.token}`)
      .send({ userId: userId });

    expect(response.status).toBe(404);
    expect(response.body.error).toBe('User is not subscribed.');
  });
});
