import { NextFunction, Request, Response } from 'express';

export function loggerGlobal(req: Request, res: Response, next: NextFunction) {
  const currentDate = new Date().toISOString();
  console.log(
    `Estas ejecutando un metodo ${req.method} en la ruta ${req.url} y en la fechaaaa ${currentDate}`,
  );
  next();
}
