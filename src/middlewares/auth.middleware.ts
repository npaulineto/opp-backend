import { Request, Response, NextFunction } from "express";

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não informado" });
  }

  const token = authHeader.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ error: "Token inválido" });
  }

  next();
}
