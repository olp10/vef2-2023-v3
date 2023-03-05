import express, { Request, Response, NextFunction } from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import { mapDbClassToClass } from '../lib/classes.js';
import { query } from '../lib/db.js';
import { findDepartmentNameBySlug } from '../lib/departments.js';

export const classesRouter = express.Router();

async function classRoute(req: Request, res: Response, next: NextFunction) {
  const { department, slug } = req.params;
  const departmentResult = await findDepartmentNameBySlug(department);
  const result = await query('SELECT * FROM classes WHERE name = $1 AND department = $2', [slug, departmentResult]);

  const classObj = mapDbClassToClass(result);
  if (!classObj) {
    return next();
  }

  res.json(classObj);
}

async function createClass(req: Request, res: Response, next: NextFunction) {
  // TODO:
}

async function deleteClass(req: Request, res: Response, next: NextFunction) {
  // TODO:
}

async function updateClass(req: Request, res: Response, next: NextFunction) {
  // TODO:
}

/**
 * Retrieve data for a single class
 */
classesRouter.get('/departments/:department/:slug',
  catchErrors(classRoute)
);

/**
 * Create a new class
 */
classesRouter.post('/departments/:department/:slug',
  catchErrors(createClass)
);

/**
 * Delete a class
 */
classesRouter.delete('/departments/:department/:slug',
  catchErrors(deleteClass)
);

// classesRouter to patch a class
classesRouter.patch('/departments/:department/:slug',
  catchErrors(updateClass)
);
