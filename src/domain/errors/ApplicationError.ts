export class ApplicationError extends Error {
  public statusCode: number;
  public errorCode: string;
  public details: any;

  constructor(message: string, statusCode: number = 500, errorCode: string = 'INTERNAL_ERROR', details: any = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.details = details;
    
    // This ensures that the correct prototype chain is maintained
    Object.setPrototypeOf(this, ApplicationError.prototype);
  }
} 