import mongoose from 'mongoose';
import request from 'supertest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../../src/server';
import UserModel from '../../src/models/user.model';

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
  await UserModel.deleteMany({});
});

const newUser = {
  name: 'Fulano',
  email: 'fulano@gmail.com',
  password: 'senha123',
};

describe('POST /users/register', () => {
  it('Should create a new user successfully', async () => {
    const response = await request(app).post('/users/register').send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).not.toBe(newUser.password);
  });

  it('Should return an error when trying to register with duplicate email', async () => {
    await request(app).post('/users/register').send(newUser);
    const response = await request(app).post('/users/register').send(newUser);

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Email already registered.');
  });
});

describe('POST /users/login', () => {
  it('Should log in and return a valid token', async () => {
    await request(app).post('/users/register').send(newUser);

    const response = await request(app)
      .post('/users/login')
      .send({ email: newUser.email, password: newUser.password });

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('Should return 404 if the user does not exist', async () => {
    const response = await request(app)
      .post('/users/login')
      .send({ email: newUser.email, password: newUser.password });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('Should return 401 if the password is incorrect', async () => {
    await request(app).post('/users/register').send(newUser);

    const response = await request(app)
      .post('/users/login')
      .send({ email: newUser.email, password: 'incorrectPassword' });

    expect(response.status).toBe(401);
    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });
});
