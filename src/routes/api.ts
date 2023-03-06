import express, { Request, Response, NextFunction } from 'express';
import { findAllDepartments } from '../lib/departments.js';

export const router = express.Router();

export async function error() {
  throw new Error('error');
}

// Mun crasha öllu
router.get('/error', error);

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await findAllDepartments();
    res.status(200).json(departments);
  } catch (err) {
    next(err);
  }
});







