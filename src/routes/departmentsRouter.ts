import express, { Request, Response, NextFunction } from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import { findClassesByDepartment } from '../lib/classes.js';
import { conditionalUpdate, dbDeleteDepartment, query } from '../lib/db.js';
import {
  departmentExists,
  findAllDepartments,
  findDepartmentIdBySlug,
  mapDbDepartmentsToDepartments,
  mapDbDepartmentToDepartment } from '../lib/departments.js';
import { isString } from '../lib/isString.js';
import { slugify } from '../utils/slugify.js';

export const departmentsRouter = express.Router();

export async function departmentsRoute(req: Request, res: Response) {
  const result = await query('SELECT * FROM departments');
  const departments = mapDbDepartmentsToDepartments(result);

  if (departments) {
    res.json(departments);
  }
  else {
    res.status(404).json({
      error: 'No departments found',
    });
  }
}

async function deleteDepartment(req: Request, res: Response) {
  const { slug } = req.params;
  try {
    dbDeleteDepartment(slug);
    res.status(204).json({
      message: 'Department deleted',
    }).end();
  } catch {
    if (!slug) {
      res.status(404).json({
        error: 'No department found',
      })
    }
    else {
      res.status(500).json({
        error: 'Failed to delete department',
      })
    }
  }
}

async function createDepartment(req: Request, res: Response) {
  const { body } = req;

  const fields = [
    'name',
    'csv',
    'slug',
    'description',
  ]


  const values = [
    isString(body.name) ? body.name : '',
    isString(body.csv) ? body.csv : `${body.name  }.csv`,
    slugify(body.name),
    isString(body.description) ? body.description : '',
  ]

  if (!fields) {
    res.status(400).json({
      error: 'Bad request',
    });
  }

  const filteredFields = fields.filter((i: any) => typeof i === 'string');

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

  const numOfCols = [];
  for (let i = 1; i < filteredFields.length + 1; i+=1) {
    numOfCols.push(`$${i}`)
  }

  // Description valkvæmt og þarf að vera sett inn conditionally
  const q = `
    INSERT INTO departments
      (${filteredFields.join(', ')})
    VALUES
      (${numOfCols.join(', ')})
    RETURNING *
    `;

  const exists = await departmentExists(body.name);
  if (exists) {
    const errors = [
      {
        error: 'Department already exists',
      }
    ]
    return res.status(400).json({
      errors,
    });
  }

  const queryValues = filteredValues;
  const result = await query(q, queryValues);
  if (result) {
    return res.status(200).json(result.rows[0]);
  }
  return [];
}

export async function patchDepartment(req : Request, res : Response) {
  const { body } = req;
  const { slug } = req.params;
  const id = await findDepartmentIdBySlug(slug);

  const fields = [
    isString(body.name) ? 'name' : null,
    isString(body.csv) ? 'csv' : null,
    isString(body.slug) ? 'slug' : null,
    isString(body.description) ? 'description' : null,
  ]

  const values = [
    isString(body.name) ? body.name : null,
    isString(body.csv) ? body.csv : null,
    isString(body.slug) ? body.slug : null,
    isString(body.description) ? body.description : null,
  ]

  if (id) {
    const result = await conditionalUpdate('departments', id.toString(), fields, values);
    if (!result) {
      return res.status(400).json({
        error: 'Nothing to update',
      })
    }

    return res.status(200).json(result);
  }

  return res.status(404).json({
    error: 'No department found',
  })
}

async function departmentRoute(req: Request, res: Response, next: NextFunction) {
  const { slug } = req.params;
  const departmentResult = await query('SELECT * FROM departments WHERE slug = $1', [slug]);

  const department = mapDbDepartmentToDepartment(departmentResult);

  if (!department) {
    return next();
  }

  const classes = await findClassesByDepartment(slug);
  department.classes = classes;

  if (department) {
    return res.status(200).json(department);
  }

    return res.status(404).json({
      error: 'No departments found',
    });

}


// Done
departmentsRouter.patch('/departments/:slug', patchDepartment)
departmentsRouter.get('/departments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await findAllDepartments();
    res.status(200).json(departments);
  } catch (err) {
    next(err);
  }
});
departmentsRouter.get('/departments/:slug', departmentRoute);
departmentsRouter.post('/departments', createDepartment);
departmentsRouter.delete('/departments/:slug', catchErrors(deleteDepartment));

