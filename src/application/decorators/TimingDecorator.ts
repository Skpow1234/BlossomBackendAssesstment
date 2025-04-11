export function Timing(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const start = process.hrtime();
    const result = await originalMethod.apply(this, args);
    const [seconds, nanoseconds] = process.hrtime(start);
    const milliseconds = seconds * 1000 + nanoseconds / 1000000;

    console.log(`Method ${propertyKey} took ${milliseconds.toFixed(2)}ms to execute`);
    return result;
  };

  return descriptor;
} 