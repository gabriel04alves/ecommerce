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
  const token = req.headers.authorization;

  if (!token) {
    return next(
      new UnauthorizedException(
        "Token not found (Unauthorized)",
        ErrorCode.UNAUTHORIZED
      )
    );
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

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

    req.user = user as any;
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
