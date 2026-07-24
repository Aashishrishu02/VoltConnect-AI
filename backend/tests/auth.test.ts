import request from 'supertest';
import app from '../src/app';

describe('Auth API Endpoints', () => {
  it('should return 400 for registration with missing fields', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
    });
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should return 400 when missing email or password on login', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body).toHaveProperty('error');
  });
});
