import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { hashSync, compareSync } from "bcrypt";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";
import { BadRequestException } from "../exceptions/bad-requests";
import { ErrorCode } from "../exceptions/root";
import { UnprocessbleEntity } from "../exceptions/validation";
import { SignUpSchema } from "../schema/users";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    SignUpSchema.parse(req.body);
    const { email, password, name } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (user) {
      return next(
        new BadRequestException(
          "User already exists",
          ErrorCode.USER_ALREADY_EXISTS
        )
      );
    }

    user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10),
      },
    });
    res.json(user);
  } catch (err: any) {
    next(
      new UnprocessbleEntity(
        err?.cause?.issues || [],
        "Unprocessable Entity",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;

    let user = await prismaClient.user.findFirst({ where: { email } });
    if (!user) {
      return next(
        new BadRequestException("User doesn't exist", ErrorCode.USER_NOT_FOUND)
      );
    }

    if (!compareSync(password, user.password)) {
      return next(
        new BadRequestException(
          "Invalid password",
          ErrorCode.INCORRECT_PASSWORD
        )
      );
    }

    const token = jwt.sign(
      {
        userId: user.id,
      },
      JWT_SECRET
    );

    res.json({ user, token });
  } catch (err: any) {
    next(
      new UnprocessbleEntity(
        err?.cause?.issues || [],
        "Unprocessable Entity",
        ErrorCode.UNPROCESSABLE_ENTITY
      )
    );
  }
};
