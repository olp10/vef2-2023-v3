import express, { Request, Response, NextFunction } from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import { findClassIdBySlug, mapDbClassesToClasses, mapDbClassToClass } from '../lib/classes.js';
import { conditionalUpdate, dbDeleteClass, query } from '../lib/db.js';
import { isString } from '../lib/isString.js';
import { slugify } from '../utils/slugify.js';

export const classesRouter = express.Router();

async function classRoute(req: Request, res: Response, next: NextFunction) {
  const { department, slug } = req.params;
  const result = await query('SELECT * FROM classes WHERE slug = $1 AND department = $2', [slug, department]);

  const classObj = mapDbClassToClass(result);
  if (!classObj) {
    return next();
  }

  res.json(classObj);
  return null;
}

async function departmentClassesRoute(req: Request, res: Response, next: NextFunction) {
  const { department } = req.params;
  const result = await query('SELECT * FROM classes WHERE department = $1', [department]);
  const classes = mapDbClassesToClasses(result);
  if (!classes) {
    return next();
  }
  res.json(classes);
  return null;
}

async function allClassesRoute(req: Request, res: Response) {
  const result = await query('SELECT * FROM classes');
  const classes = mapDbClassesToClasses(result);
  if (classes) {
    res.json(classes);
  }
  else {
    res.status(404).json({
      error: 'No classes found',
    });
  }
  return null;
}

async function createClass(req: Request, res: Response) {
  const { body } = req;
  const fields = [
    isString(body.name) ? 'name' : null,
    isString(body.number) ? 'number' : null,
    isString(body.semester) ? 'semester' : null,
    isString(body.degree) ? 'degree' : null,
    typeof(body.credits) === 'number' ? 'credits' : null,
    isString(body.department) ? 'department' : null,
    isString(body.linkToSyllabus) ? 'linkToSyllabus' : null,
    'slug',
  ]
  const values = [
    isString(body.name) ? body.name : null,
    isString(body.number) ? body.number : null,
    isString(body.semester) ? body.semester : null,
    typeof(body.credits) === 'number' ? body.credits : 0,
    isString(body.department) ? body.department : null,
    isString(body.linkToSyllabus) ? body.linkToSyllabus : null,
    slugify(body.name),
    isString(body.degree) ? body.degree : null,
  ]

  if (!fields) {
    res.status(400).json({
      error: 'Bad request',
    });
  }

  const filteredFields = fields.filter((i: any) => typeof i === 'string' || typeof i === 'number');

  const filteredValues = values.filter(
    (i: any) => typeof i === 'string' || typeof i === 'number' || i instanceof Date
  );

  if (filteredFields.length === 0) {
    return [];
  }

  if (filteredFields.length !== filteredValues.length) {
    return  res.status(400).json({
      error: 'Failed to create department',
    })
  }

  // TODO: Ætti að vera conditional hér ef einhverju valkvæmu sleppt
  // Virkar bara að búa til nýjan þegar allir reitir sendir með post
  const q = `
    INSERT INTO classes
      (name, number, semester, credits, department, linkToSyllabus, slug, degree)
    VALUES
      ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
    `;

  const queryValues = filteredValues;
  console.log(queryValues);
  const result = await query(q, queryValues);
  if (result) {
    return res.status(200).json(result.rows[0]);
  }
  return null;
}

async function deleteClass(req: Request, res: Response) {
  // TODO:
  const { id, slug } = req.params;
  try {
    dbDeleteClass(slug);
    res.status(204).json({
      message: 'Class deleted',
    }).end();
  } catch {
    if (!slug) {
      res.status(404).json({
        error: 'No class found',
      })
    }
    else {
      res.status(500).json({
        error: 'Failed to delete class',
      })
    }
  }
}

async function patchClass(req: Request, res: Response) {
  // TODO:
  const { body } = req;
  const { slug } = req.params;
  const id = await findClassIdBySlug(slug);

  const fields = [
    isString(body.name) ? 'name' : null,
    isString(body.number) ? 'number' : null,
    isString(body.semester) ? 'semester' : null,
    isString(body.degree) ? 'degree' : null,
    typeof(body.credits) === 'number' ? 'credits' : null,
    isString(body.department) ? 'department' : null,
    isString(body.linkToSyllabus) ? 'linkToSyllabus' : null,
  ]

  const values = [
    isString(body.name) ? body.name : null,
    isString(body.number) ? body.number : null,
    isString(body.semester) ? body.semester : null,
    isString(body.degree) ? body.degree : null,
    typeof(body.credits) === 'number' ? body.credits : 0,
    isString(body.department) ? body.department : null,
    isString(body.linkToSyllabus) ? body.linkToSyllabus : null,
  ]

  if (id) {
    const result = await conditionalUpdate('classes', id.toString(), fields, values);
    if (!result) {
      return res.status(400).json({
        error: 'Nothing to update',
      })
    }

    return res.status(200).json(result);
  }

  return res.status(404).json({
    error: 'No class found',
  })
}

// done


classesRouter.get('/classes', allClassesRoute);
classesRouter.get('/departments/:department/classes', departmentClassesRoute);
classesRouter.get('/departments/:department/classes/:slug',
  classRoute
);
classesRouter.post('/departments/:department/classes', createClass);

classesRouter.delete('/departments/:department/classes/:slug',
  catchErrors(deleteClass)
);

classesRouter.patch('/departments/:department/classes/:slug', patchClass);
