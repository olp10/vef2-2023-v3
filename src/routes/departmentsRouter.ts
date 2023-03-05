import express, { Request, Response, NextFunction } from 'express';
import { catchErrors } from '../lib/catch-errors.js';
import { query } from '../lib/db.js';
import { findAllDepartments, mapDbDepartmentsToDepartments, mapDbDepartmentToDepartment } from '../lib/departments.js';

export const departmentsRouter = express.Router();

export async function departmentsRoute(req: Request, res: Response, next: NextFunction) {
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

async function patchDepartment() {
  // TODO:
}

async function deleteDepartment() {
  // TODO:
}

async function createDepartment() {
  // TODO:
}

async function departmentRoute(req: Request, res: Response, next: NextFunction) {
  const { slug } = req.params;
  const departmentResult = await query('SELECT * FROM departments WHERE slug = $1', [slug]);

  const department = mapDbDepartmentToDepartment(departmentResult);

  if (!department) {
    return next();
  }

  res.json(department);
}

// router.get('/', catchErrors(index));


/**
 * returns all departments
 */
departmentsRouter.get('/departments', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const departments = await findAllDepartments();
    res.status(200).json(departments);
  } catch (err) {
    next(err);
  }
}
);

/**
 * Skilar stakri deild
 */
departmentsRouter.get('/departments/:slug', catchErrors(departmentRoute));  // TODO Add catchErrors(--Eitthvað sem fer inní það--)

/**
 * Býr til nýja deild
 */
departmentsRouter.post('/departments', createDepartment);

// TODO: 200 OK -> Skilað ásamt upplýsingum um deild
// TODO: 400 Bad Request -> Skilað ef gögn ekki rétt (vantar/á röngu formi/ólöglegt)  Einhvers konar validation/sanitation middleware

/**
 * Uppfærir deild
 */
departmentsRouter.patch('/departments/:slug', patchDepartment)
// TODO: 200 OK skilað með uppfærðri deild ef gekk.
// TODO: 400 Bad Request skilað ef gögn sem send inn eru ekki rétt.
// TODO: 404 Not Found skilað ef deild er ekki til.
// TODO: 500 Internal Error skilað ef villa kom upp.

/**
 * Eyðir deild
 */
departmentsRouter.delete('/departments/:slug', deleteDepartment)
// TODO: 204 No Content skilað ef gekk.
// TODO: 404 Not Found skilað ef deild er ekki til.
// TODO: 500 Internal Error skilað ef villa kom upp.
