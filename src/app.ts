import express from 'express';
import dotenv from 'dotenv';
import { router } from './routes/api.js';
import { departmentsRouter } from './routes/departmentsRouter.js';
import { classesRouter } from './routes/classesRouter.js';

dotenv.config();

const app = express();

app.use(express.json());

app.use(router);
app.use(departmentsRouter);
app.use(classesRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.info(`Server running at http://localhost:${port}/`);
});

function notFoundHandler(req : express.Request, res: express.Response) {
  console.warn('Not found', req.originalUrl);
  res.status(404).json({
    error: 'Not found',
  });
}

function errorHandler(err: Error, req: express.Request, res: express.Response) {
  console.error(err);
  res.status(500).json({
    error: err.message,
  });
}

app.use(notFoundHandler);
app.use(errorHandler);
