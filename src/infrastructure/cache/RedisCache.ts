import { createClient } from 'redis';
import { Logger } from '../utils/Logger';
import { Cache } from '../../domain/cache/Cache';
import config from '../../config/environment';
import Redis from 'ioredis';

export class RedisCache implements Cache {
  private client;
  private logger: Logger;
  private isConnected: boolean = false;

  constructor(
    host: string = process.env.REDIS_HOST || 'redis',
    port: number = parseInt(process.env.REDIS_PORT || '6379'),
    password: string = process.env.REDIS_PASSWORD || ''
  ) {
    this.logger = new Logger('RedisCache');
    try {
      this.client = new Redis({
        host,
        port,
        password: password || undefined,
        retryStrategy: (times) => {
          const delay = Math.min(times * 50, 2000);
          this.logger.info(`Retrying Redis connection in ${delay}ms...`);
          return delay;
        },
        maxRetriesPerRequest: 3,
        enableOfflineQueue: false,
      });

      this.client.on('error', (err) => {
        this.logger.error(`Redis Client Error`, err);
        // Don't throw the error, just log it and continue
      });

      this.client.on('connect', () => {
        this.logger.info(`Connected to Redis at ${host}:${port}`);
      });
    } catch (error) {
      this.logger.error(`Error initializing Redis client`, error);
      // Create a mock client that logs operations but doesn't fail
      this.client = {
        get: async (key: string) => {
          this.logger.info(`[MOCK] GET ${key}`);
          return null;
        },
        set: async (key: string, value: string, mode?: string, duration?: number) => {
          this.logger.info(`[MOCK] SET ${key}`);
          return 'OK';
        },
        del: async (key: string) => {
          this.logger.info(`[MOCK] DEL ${key}`);
          return 1;
        },
        flushall: async () => {
          this.logger.info(`[MOCK] FLUSHALL`);
          return 'OK';
        },
        on: () => this,
      } as any;
    }
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (error) {
      this.logger.error('Failed to connect to Redis', error);
    }
  }

  async get(key: string): Promise<string | null> {
    try {
      if (!this.isConnected) {
        this.logger.warn('Redis client not connected, attempting to reconnect');
        await this.connect();
      }
      return await this.client.get(key);
    } catch (error) {
      this.logger.error(`Error getting key ${key} from cache`, error);
      return null;
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    try {
      if (!this.isConnected) {
        this.logger.warn('Redis client not connected, attempting to reconnect');
        await this.connect();
      }
      
      if (ttl) {
        await this.client.set(key, value, { EX: ttl });
      } else {
        await this.client.set(key, value);
      }
    } catch (error) {
      this.logger.error(`Error setting key ${key} in cache`, error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (!this.isConnected) {
        this.logger.warn('Redis client not connected, attempting to reconnect');
        await this.connect();
      }
      await this.client.del(key);
    } catch (error) {
      this.logger.error(`Error deleting key ${key} from cache`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      if (!this.isConnected) {
        this.logger.warn('Redis client not connected, attempting to reconnect');
        await this.connect();
      }
      await this.client.flushAll();
      this.logger.info('Cache cleared');
    } catch (error) {
      this.logger.error('Error clearing cache', error);
    }
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