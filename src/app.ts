import express, { Application, RequestHandler } from 'express';
import compression from 'compression';
import hpp from 'hpp';
import pinoHttp from 'pino-http';
import swaggerUi from 'swagger-ui-express';
 
import  env  from './config/env.js';
import { logger } from './config/logger.js';

import { securityHeaders } from './middlewares/security.middleware.js';
import { corsMiddleware } from './middlewares/cors.middleware.js';
import { globalLimiter } from './middlewares/rateLimiter.middleware.js';
import { errorHandler } from './middlewares/error.middleware.js';
import { notFound } from './middlewares/notFound.middleware.js';
import userRoutes from './routes/user.routes.js';
import authRoutes from './routes/auth.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import testimonialRoutes from './routes/testimonial.routes.js';
import newsletterRoutes from './routes/newsletter.routes.js';
import { swaggerSpec } from './docs/swagger.js';
 
const app: Application = express();

logger.info({ nodeEnv: env.NODE_ENV }, 'Configuration backend chargée');
 
app.set('trust proxy', 1);
 
// Sécurité et hygiène HTTP — dans cet ordre, avant tout le reste.
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(compression());
app.use(hpp());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
const pinoMiddleware = pinoHttp as unknown as (options: { logger: typeof logger }) => RequestHandler;
app.use(pinoMiddleware({ logger }));
app.use(globalLimiter);
 
// Documentation Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
 
// Supervision
app.get('/health', (_req, res) => res.status(200).json({ status: 'ok' }));
 
// Routes métier, préfixées et versionnées
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/newsletter', newsletterRoutes);
 
app.use(notFound);
app.use(errorHandler);
 
export default app;