declare module 'graphql-subscriptions' {
  export class PubSub {
    constructor();
    publish(topic: string, payload: any): Promise<void>;
    subscribe(topic: string, onMessage: (payload: any) => void): Promise<number>;
    unsubscribe(subId: number): void;
    asyncIterator<T>(topics: string | string[]): AsyncIterator<T>;
  }
}

declare module 'cron' {
  export class CronJob {
    constructor(cronTime: string | Date, onTick: () => void, onComplete?: () => void, start?: boolean, timeZone?: string, context?: any, runOnInit?: boolean);
    start(): void;
    stop(): void;
  }
}

declare module 'ioredis' {
  export class Redis {
    constructor(options?: any);
    get(key: string): Promise<string | null>;
    set(key: string, value: string, mode?: string, duration?: number): Promise<string>;
    del(key: string): Promise<number>;
    flushall(): Promise<string>;
  }
}

declare module 'swagger-jsdoc' {
  export interface Options {
    definition: {
      info: {
        title: string;
        version: string;
        description: string;
      };
      host?: string;
      basePath?: string;
      schemes?: string[];
      consumes?: string[];
      produces?: string[];
      securityDefinitions?: {
        [key: string]: {
          type: string;
          name: string;
          in: string;
        };
      };
    };
    apis: string[];
  }
}

declare module '@domain/cache/Cache' {
  export interface Cache {
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
    clear(): Promise<void>;
    generateKey(prefix: string, params: Record<string, any>): string;
  }
}

declare module '@domain/decorators/Timing' {
  export function Timing(target: any, propertyKey: string, descriptor: PropertyDescriptor): void;
}

declare module '@domain/services/character/CharacterService' {
  import { Character } from '../../../domain/entities/Character';
  export interface CharacterService {
    getAllCharacters(): Promise<Character[]>;
    getCharacterById(id: string): Promise<Character | null>;
    searchCharacters(query: string): Promise<Character[]>;
    syncCharacter(rickAndMortyId: number): Promise<Character>;
    updateCharacter(id: number, character: Partial<Character>): Promise<[number, Character[]]>;
    deleteCharacter(id: number): Promise<void>;
  }
}

declare module '@repositories/CharacterRepository' {
  import { Character } from '../../../domain/entities/Character';
  export interface CharacterRepository {
    findAll(): Promise<Character[]>;
    findById(id: number): Promise<Character | null>;
    findByRickAndMortyId(id: number): Promise<Character | null>;
    search(query: string): Promise<Character[]>;
    create(character: Partial<Character>): Promise<Character>;
    update(id: number, character: Partial<Character>): Promise<[number, Character[]]>;
    delete(id: number): Promise<number>;
  }
}

declare global {
  interface Timing {
    start: number;
    end: number;
    duration: number;
  }
}

export function Timing(target: any, propertyKey: string, descriptor: PropertyDescriptor): void; 