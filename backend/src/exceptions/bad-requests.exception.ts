import { ErrorCode, HttpException } from "./root.exception";

export class BadRequestException extends HttpException {
  constructor(message: string, errorCode: ErrorCode, error?: any) {
    super(message, errorCode, 400, error);
  }
}
