import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../infrastructure/utils/Logger';
import { ApplicationError } from '../../domain/errors/ApplicationError';

const logger = new Logger('ErrorHandler');

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log the error
  logger.error(`Error occurred: ${err.message}`, err);

  // Handle Sequelize validation errors
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = (err as any).errors.map((e: any) => ({
      field: e.path,
      message: e.message,
      value: e.value
    }));

    res.status(400).json({
      status: 'error',
      errorCode: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors
    });
    return;
  }

  // Handle our custom application errors
  if (err instanceof ApplicationError) {
    res.status(err.statusCode).json({
      status: 'error',
      errorCode: err.errorCode,
      message: err.message,
      details: err.details
    });
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      status: 'error',
      errorCode: 'INVALID_TOKEN',
      message: 'Invalid authentication token'
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      status: 'error',
      errorCode: 'TOKEN_EXPIRED',
      message: 'Authentication token expired'
    });
    return;
  }

  // Default error response
  res.status(500).json({
    status: 'error',
    errorCode: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred' 
      : err.message
  });
}; 