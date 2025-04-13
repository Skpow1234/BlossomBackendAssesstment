import { Cache } from '../../domain/cache/Cache';
import { Logger } from '../utils/Logger';

/**
 * A mock implementation of Redis cache for development and testing
 * when a real Redis instance is not available
 */
export class MockRedisCache implements Cache {
  private cache: Map<string, { value: string, expiry: number | null }>;
  private logger: Logger;

  constructor() {
    this.cache = new Map();
    this.logger = new Logger('MockRedisCache');
    this.logger.info('Using in-memory mock cache instead of Redis');
  }

  async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    
    if (!item) {
      this.logger.debug(`Cache miss: ${key}`);
      return null;
    }
    
    // Check if the item has expired
    if (item.expiry !== null && item.expiry < Date.now()) {
      this.logger.debug(`Cache expired: ${key}`);
      this.cache.delete(key);
      return null;
    }
    
    this.logger.debug(`Cache hit: ${key}`);
    return item.value;
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    const expiry = ttl ? Date.now() + (ttl * 1000) : null;
    this.cache.set(key, { value, expiry });
    this.logger.debug(`Cache set: ${key}, TTL: ${ttl || 'none'}`);
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
    this.logger.debug(`Cache delete: ${key}`);
  }

  async clear(): Promise<void> {
    this.cache.clear();
    this.logger.info('Cache cleared');
  }

  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((acc: Record<string, any>, key: string) => {
        acc[key] = params[key];
        return acc;
      }, {});

    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }
} 