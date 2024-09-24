import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized";
import { ErrorCode } from "../exceptions/root";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { prismaClient } from "..";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1]; // Obtém apenas o token

  if (!token) {
    console.log("Token not found (Unauthorized)");
    return next(
      new UnauthorizedException(
        "Token not found (Unauthorized)",
        ErrorCode.UNAUTHORIZED
      )
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;

    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      return next(
        new UnauthorizedException(
          "User not found (Unauthorized)",
          ErrorCode.UNAUTHORIZED
        )
      );
    }

    req.user = user;
    next();
  } catch (error) {
    return next(
      new UnauthorizedException(
        "Invalid token (Unauthorized)",
        ErrorCode.UNAUTHORIZED
      )
    );
  }
};

export default authMiddleware;
