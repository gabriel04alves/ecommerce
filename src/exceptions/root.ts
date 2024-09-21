export class HttpException extends Error {
  message: string;
  errorCode: any;
  statusCode: number;
  errors: ErrorCode;

  constructor(
    message: string,
    errorCode: ErrorCode,
    statusCode: number,
    errors: any
  ) {
    super(message);
    this.message = message;
    this.errorCode = errorCode;
    this.statusCode = statusCode;
    this.errors = errors;
  }
}

export enum ErrorCode {
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNAUTHORIZED = 1004,
  UNPROCESSABLE_ENTITY = 2001,
  INTERNAL_EXCEPTION = 3001,

  PRODUCT_NOT_FOUND = 4001,
  PRODUCT_ALREADY_EXISTS = 4002,
  PRODUCT_INVALID_ID = 4003,
  PRODUCT_UNAUTHORIZED_ACCESS = 4004,
  PRODUCT_VALIDATION_FAILED = 4005,
  PRODUCT_OUT_OF_STOCK = 4006,
}
