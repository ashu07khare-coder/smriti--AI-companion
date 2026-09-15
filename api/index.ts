import express from 'express';
import { apiRouter } from '../server/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging for API endpoints
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    console.log(`[Vercel Serverless API] ${req.method} ${req.path}`);
  }
  next();
});

// Mount API router
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

export default app;
