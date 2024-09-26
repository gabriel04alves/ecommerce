import { NextFunction, Request, Response } from "express";
import { UnauthorizedException } from "../exceptions/unauthorized.exception";
import { ErrorCode } from "../exceptions/root.exception";

const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    next();
  } else {
    return next(
      new UnauthorizedException(
        "Token not found (Unauthorized)",
        ErrorCode.UNAUTHORIZED
      )
    );
  }
};

export default adminMiddleware;
