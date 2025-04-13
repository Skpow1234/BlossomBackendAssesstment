import { ApplicationError } from './ApplicationError';

export class ValidationError extends ApplicationError {
  constructor(message: string = 'Validation failed', details: any = {}) {
    super(message, 400, 'VALIDATION_ERROR', details);
    
    // Maintain proper prototype chain
    Object.setPrototypeOf(this, ValidationError.prototype);
  }
} 