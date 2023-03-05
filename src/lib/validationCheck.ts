import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/*
export function validationCheck(req: Request, res: Response, next: NextFunction) {
  const validation = validationResult(req);

  if(!validation.isEmpty()) {
    const notFoundError = validation.errors.find(
      (error: { msg: string; }) => error.msg === 'not found'
    );
    const serverError = validation.errors.find(
      (error: { msg: string; }) => error.msg === 'server error'
    );

    let status = 400;

    if (serverError) {
      status = 500;
    } else if (notFoundError) {
      status = 404;
    }

    return res.status(status).json({
      errors: validation.errors
    });
  }
}
*/
