import { Logger } from '../../infrastructure/utils/Logger';

export function Timing(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;
  const logger = new Logger('TimingDecorator');

  descriptor.value = async function(...args: any[]) {
    const start = Date.now();
    try {
      return await originalMethod.apply(this, args);
    } finally {
      const end = Date.now();
      const duration = end - start;
      logger.info(`${target.constructor.name}.${propertyKey} executed in ${duration}ms`);
    }
  };

  return descriptor;
} 