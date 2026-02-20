import express from 'express';
import cors from 'cors';
import { env } from './utils/env.js';
import router from './routers/index.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import compression from 'compression';
import { pinoHttp } from 'pino-http';

const PORT = Number(env('PORT', '3000'));

export const startServer = () => {
  const app = express();

  const isProduction = process.env.NODE_ENV === 'production';

  app.set('trust proxy', 1);

  // Security & Performance
  app.use(helmet());
  app.use(compression());

  // Logging
  app.use(
    pinoHttp({
      transport: isProduction
        ? undefined
        : {
          target: 'pino-pretty',
          options: { colorize: true },
        },
    }),
  );

  // CORS yapılandırması
  const allowedOrigins = [
    'http://localhost:5173',
    'https://lavelineconcept.com',
    'https://lavelineconcept-frontend-git-0ad162-la-veline-concepts-projects.vercel.app/',
  ];

  app.use(
    cors({
      origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
    }),
  );

  app.use(
    express.json({ type: ['application/json', 'application/vnd.api+json'] }),
  );


  app.use(cookieParser());


  app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Laveline Concept API' });
  });


  app.use('/api', router);

  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
    console.log(`🌍 Mode: ${isProduction ? 'Production' : 'Development'}`);
  });
};
