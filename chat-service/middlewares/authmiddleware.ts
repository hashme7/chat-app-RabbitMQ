import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const secretKey = "chatSecret";

const authenticateToken = (req: Request, res: Response) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.sendStatus(403);
    if (req.user) {
      req.user = user;
    }
    next();
  });
};
