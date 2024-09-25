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
  // User errors
  USER_NOT_FOUND = 1001,
  USER_ALREADY_EXISTS = 1002,
  INCORRECT_PASSWORD = 1003,
  UNAUTHORIZED = 1004,

  // Unprocessable entity
  UNPROCESSABLE_ENTITY = 2001,

  // Internal exceptions
  INTERNAL_EXCEPTION = 3001,

  // Product errors
  PRODUCT_NOT_FOUND = 4001,
  PRODUCT_ALREADY_EXISTS = 4002,
  PRODUCT_INVALID_ID = 4003,
  PRODUCT_UNAUTHORIZED_ACCESS = 4004,
  PRODUCT_VALIDATION_FAILED = 4005,
  PRODUCT_OUT_OF_STOCK = 4006,

  // Address errors
  ADDRESS_NOT_FOUND = 5001,
  ADDRESS_ALREADY_EXISTS = 5002,
  ADDRESS_VALIDATION_FAILED = 5003,
  ADDRESS_UNAUTHORIZED_ACCESS = 5004,

  // Cart errors
  CART_NOT_FOUND = 6001,
  CART_EMPTY = 6002,
  CART_ITEM_NOT_FOUND = 6003,
  CART_UNAUTHORIZED_ACCESS = 6004,
  CART_VALIDATION_FAILED = 6005,

  // Order errors
  ORDER_NOT_FOUND = 7001,
  ORDER_ALREADY_EXISTS = 7002,
  ORDER_VALIDATION_FAILED = 7003,
  ORDER_UNAUTHORIZED_ACCESS = 7004,
  ORDER_CANNOT_BE_MODIFIED = 7005,
}
