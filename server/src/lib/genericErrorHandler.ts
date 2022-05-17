import {
  InternalServerErrorException,
  HttpException,
  Logger,
} from '@nestjs/common';

export function genericErrorHandler(
  error,
): InternalServerErrorException | HttpException {
  const message = error.response
    ? error.response
    : error.message || error.stack;
  Logger.error(JSON.stringify(message), 'GenericErrorHandler');
  Logger.error(JSON.stringify(error), 'GenericErrorHandlerDetailed');
  if (error instanceof HttpException) {
    throw error;
  } else {
    throw new InternalServerErrorException(message);
  }
}
