import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import { setupSwagger } from './config/swagger';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Rate Limiter
app.use('/api', apiLimiter);

// Swagger Documentation
setupSwagger(app);

// API Routes
app.use('/api/v1', routes);

// Healthcheck Route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'ChargeShare Backend', timestamp: new Date() });
});

// Global Error Handler
app.use(errorHandler);

export default app;
