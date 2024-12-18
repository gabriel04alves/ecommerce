import { NextFunction, Request, Response } from "express";
import { ErrorCode, HttpException } from "./root.exception";
import { InternalException } from "./internal-exception.exception";
import { ZodError } from "zod";
import { BadRequestException } from "./bad-requests.exception";

export const errorHandler = (method: Function) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await method(req, res, next);
    } catch (error: any) {
      let exception: HttpException;
      if (error instanceof HttpException) {
        exception = error;
      } else if (error.name === "ZodError") {
        exception = new HttpException(
          "Validation error",
          ErrorCode.UNPROCESSABLE_ENTITY,
          422,
          error.issues
        );
      } else {
        if (error instanceof ZodError) {
          exception = new BadRequestException(
            "Unprocessable Entity",
            ErrorCode.UNPROCESSABLE_ENTITY,
            error
          );
        } else {
          exception = new InternalException(
            "Something went wrong",
            error,
            ErrorCode.INTERNAL_EXCEPTION
          );
        }
      }
      next(exception);
    }
  };
};
