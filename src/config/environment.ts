import dotenv from 'dotenv';
import path from 'path';
import { Logger } from '../infrastructure/utils/Logger';

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const logger = new Logger('Environment');

interface EnvironmentConfig {
  NODE_ENV: string;
  PORT: number;
  
  // Database
  DB_HOST: string;
  DB_PORT: number;
  DB_NAME: string;
  DB_USER: string;
  DB_PASSWORD: string;
  
  // Redis
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string | null;
  
  // Rick and Morty API
  RICK_AND_MORTY_API_URL: string;
  
  // CORS
  CORS_ORIGIN: string;
  
  // Cron
  CHARACTER_SYNC_CRON: string;
  
  // API
  API_KEY: string;
}

// Default values
const defaultConfig: EnvironmentConfig = {
  NODE_ENV: 'development',
  PORT: 3000,
  
  // Database
  DB_HOST: 'localhost',
  DB_PORT: 3306,
  DB_NAME: 'rickandmorty',
  DB_USER: 'root',
  DB_PASSWORD: 'password',
  
  // Redis
  REDIS_HOST: 'localhost',
  REDIS_PORT: 6379,
  REDIS_PASSWORD: null,
  
  // Rick and Morty API
  RICK_AND_MORTY_API_URL: 'https://rickandmortyapi.com/api',
  
  // CORS
  CORS_ORIGIN: '*',
  
  // Cron
  CHARACTER_SYNC_CRON: '0 */12 * * *', // Every 12 hours
  
  // API
  API_KEY: 'my-secret-api-key'
};

/**
 * Get environment variable with validation and type conversion
 */
function getEnvVar<T>(name: string, defaultValue: T, transform: (value: string) => T): T {
  const value = process.env[name];
  
  if (!value) {
    logger.warn(`Environment variable ${name} not set, using default: ${defaultValue}`);
    return defaultValue;
  }
  
  try {
    return transform(value);
  } catch (error) {
    logger.error(`Error parsing environment variable ${name}, using default: ${defaultValue}`, error);
    return defaultValue;
  }
}

// Create the config object with validation
export const config: EnvironmentConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', defaultConfig.NODE_ENV, (value) => value),
  PORT: getEnvVar('PORT', defaultConfig.PORT, (value) => parseInt(value, 10)),
  
  // Database
  DB_HOST: getEnvVar('DB_HOST', defaultConfig.DB_HOST, (value) => value),
  DB_PORT: getEnvVar('DB_PORT', defaultConfig.DB_PORT, (value) => parseInt(value, 10)),
  DB_NAME: getEnvVar('DB_NAME', defaultConfig.DB_NAME, (value) => value),
  DB_USER: getEnvVar('DB_USER', defaultConfig.DB_USER, (value) => value),
  DB_PASSWORD: getEnvVar('DB_PASSWORD', defaultConfig.DB_PASSWORD, (value) => value),
  
  // Redis
  REDIS_HOST: getEnvVar('REDIS_HOST', defaultConfig.REDIS_HOST, (value) => value),
  REDIS_PORT: getEnvVar('REDIS_PORT', defaultConfig.REDIS_PORT, (value) => parseInt(value, 10)),
  REDIS_PASSWORD: getEnvVar('REDIS_PASSWORD', defaultConfig.REDIS_PASSWORD, (value) => value || null),
  
  // Rick and Morty API
  RICK_AND_MORTY_API_URL: getEnvVar('RICK_AND_MORTY_API_URL', defaultConfig.RICK_AND_MORTY_API_URL, (value) => value),
  
  // CORS
  CORS_ORIGIN: getEnvVar('CORS_ORIGIN', defaultConfig.CORS_ORIGIN, (value) => value),
  
  // Cron
  CHARACTER_SYNC_CRON: getEnvVar('CHARACTER_SYNC_CRON', defaultConfig.CHARACTER_SYNC_CRON, (value) => value),
  
  // API
  API_KEY: getEnvVar('API_KEY', defaultConfig.API_KEY, (value) => value)
};

// Validate required configuration
function validateConfig(config: EnvironmentConfig): void {
  // Validate database connection
  if (!config.DB_HOST || !config.DB_NAME || !config.DB_USER) {
    logger.warn('Database configuration is incomplete. Some features may not work properly.');
  }
  
  // Validate Redis configuration
  if (!config.REDIS_HOST) {
    logger.warn('Redis configuration is incomplete. Caching may not work properly.');
  }
  
  // Validate API key in production
  if (config.NODE_ENV === 'production' && config.API_KEY === defaultConfig.API_KEY) {
    logger.warn('Using default API key in production is not recommended.');
  }
  
  logger.info(`Application configured for ${config.NODE_ENV} environment`);
}

validateConfig(config);

export default config; 