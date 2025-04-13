export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, ...meta: any[]): void {
    console.log(`[INFO] [${this.context}] ${message}`, ...meta);
  }

  error(message: string, error?: any): void {
    console.error(`[ERROR] [${this.context}] ${message}`, error ? error : '');
  }

  warn(message: string, ...meta: any[]): void {
    console.warn(`[WARN] [${this.context}] ${message}`, ...meta);
  }

  debug(message: string, ...meta: any[]): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] [${this.context}] ${message}`, ...meta);
    }
  }
} 