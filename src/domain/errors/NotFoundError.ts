import { ApplicationError } from './ApplicationError';

export class NotFoundError extends ApplicationError {
  constructor(message: string = 'Resource not found', errorCode: string = 'NOT_FOUND', details: any = {}) {
    super(message, 404, errorCode, details);
    
    // Maintain proper prototype chain
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
} 