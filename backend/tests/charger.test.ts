import request from 'supertest';
import app from '../src/app';

describe('Charger API Endpoints', () => {
  it('should return healthcheck status 200', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toEqual('ok');
  });
});
