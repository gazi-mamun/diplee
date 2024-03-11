import { Request, Response, NextFunction } from 'express';

export function tokenCon(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.cookies.access_token;
  if (authHeader) {
    req.headers.authorization = `Bearer ${authHeader}`;
  }
  next();
}
