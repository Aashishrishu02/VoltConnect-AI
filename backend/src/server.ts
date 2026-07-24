import http from 'http';
import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';
import { initSocket } from './services/socket.service';

const server = http.createServer(app);

// Initialize WebSockets
initSocket(server);

server.listen(env.PORT, () => {
  logger.info(`🚀 ChargeShare Backend running on http://localhost:${env.PORT}`);
  logger.info(`📚 Swagger OpenAPI docs available at http://localhost:${env.PORT}/api-docs`);
});
