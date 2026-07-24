import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'ChargeShare P2P EV Network API Specification',
    version: '1.0.0',
    description: 'Complete OpenAPI documentation for ChargeShare EV Charger sharing network.',
  },
  servers: [
    {
      url: 'http://localhost:5000/api/v1',
      description: 'Development Server',
    },
  ],
  paths: {
    '/auth/login': {
      post: {
        summary: 'Authenticate User',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', example: 'driver.michael@chargeshare.com' },
                  password: { type: 'string', example: 'password123' },
                },
              },
            },
          },
        },
        responses: { 200: { description: 'Success' } },
      },
    },
    '/chargers/search': {
      get: {
        summary: 'Search & Filter Nearby Chargers',
        parameters: [
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'lat', in: 'query', schema: { type: 'number' } },
          { name: 'lng', in: 'query', schema: { type: 'number' } },
          { name: 'chargerType', in: 'query', schema: { type: 'string' } },
        ],
        responses: { 200: { description: 'List of EV Chargers' } },
      },
    },
  },
};

export function setupSwagger(app: Express) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}
