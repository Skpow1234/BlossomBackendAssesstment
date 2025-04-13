import axios from 'axios';
import { RedisCache } from '../cache/RedisCache';
import { Timing } from '../../domain/decorators/Timing';
import { Logger } from '../utils/Logger';
import { Character } from '../../domain/entities/Character';
import config from '../../config/environment';

export class RickAndMortyAPI {
  private baseUrl: string;
  private cache: RedisCache;
  private logger: Logger;

  constructor(baseUrl: string = config.RICK_AND_MORTY_API_URL) {
    this.baseUrl = baseUrl;
    this.cache = new RedisCache();
    this.logger = new Logger('RickAndMortyAPI');
  }

  @Timing
  async getCharacter(id: number): Promise<Character | null> {
    try {
      const cacheKey = this.cache.generateKey('character', { id });
      const cachedData = await this.cache.get(cacheKey);

      if (cachedData) {
        this.logger.info(`Cache hit for character ${id}`);
        return this.mapToCharacter(JSON.parse(cachedData));
      }

      this.logger.info(`Fetching character ${id} from Rick and Morty API`);
      const response = await axios.get(`${this.baseUrl}/character/${id}`);
      const data = response.data;

      await this.cache.set(cacheKey, JSON.stringify(data), 3600);
      return this.mapToCharacter(data);
    } catch (error) {
      this.logger.error(`Error fetching character ${id} from Rick and Morty API`, error);
      return null;
    }
  }

  @Timing
  async getAllCharacters(page: number = 1): Promise<Character[]> {
    try {
      const cacheKey = this.cache.generateKey('all-characters', { page });
      const cachedData = await this.cache.get(cacheKey);

      if (cachedData) {
        this.logger.info(`Cache hit for all characters page ${page}`);
        return JSON.parse(cachedData);
      }

      this.logger.info(`Fetching all characters page ${page} from Rick and Morty API`);
      const response = await axios.get(`${this.baseUrl}/character?page=${page}`);
      const characters = response.data.results.map(this.mapToCharacter);

      await this.cache.set(cacheKey, JSON.stringify(characters), 3600);
      return characters;
    } catch (error) {
      this.logger.error('Error fetching characters from Rick and Morty API', error);
      return [];
    }
  }

  @Timing
  async searchCharacters(query: string): Promise<Character[]> {
    try {
      const cacheKey = this.cache.generateKey('search-characters', { query });
      const cachedData = await this.cache.get(cacheKey);

      if (cachedData) {
        this.logger.info(`Cache hit for character search "${query}"`);
        return JSON.parse(cachedData);
      }

      this.logger.info(`Searching characters with query "${query}" in Rick and Morty API`);
      const response = await axios.get(`${this.baseUrl}/character/?name=${encodeURIComponent(query)}`);
      const characters = response.data.results.map(this.mapToCharacter);
      
      await this.cache.set(cacheKey, JSON.stringify(characters), 3600);
      return characters;
    } catch (error) {
      this.logger.error(`Error searching characters with query ${query}`, error);
      return [];
    }
  }

  private mapToCharacter(data: any): Character {
    return {
      id: data.id.toString(),
      rickAndMortyId: data.id,
      name: data.name,
      status: data.status,
      species: data.species,
      type: data.type || '',
      gender: data.gender,
      origin: typeof data.origin === 'object' ? data.origin.name : data.origin,
      location: typeof data.location === 'object' ? data.location.name : data.location,
      image: data.image,
      episode: data.episode,
      url: data.url,
      created: data.created
    };
  }
} 