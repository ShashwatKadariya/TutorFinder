import { HttpStatus } from '@nestjs/common';

type apiResponseWithMessage<T> = {
  statusCode: number;
  headers?: Record<string, string>;
  body: { message: T; errorMessage?: never };
};
type apiResponseWithErrorMessage<T> = {
  statusCode: number;
  headers?: Record<string, string>;
  body: { message?: never; errorMessage: T };
};

export type ApiResponse<T> =
  | apiResponseWithMessage<T>
  | apiResponseWithErrorMessage<T>;

export const successResponse: ApiResponse<{}> = {
  statusCode: HttpStatus.OK,
  body: { message: 'Success' },
};
