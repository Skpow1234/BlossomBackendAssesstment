import axios from 'axios';
import { RedisCache } from '../cache/RedisCache';

export class RickAndMortyAPI {
  private baseUrl = 'https://rickandmortyapi.com/api';
  private cache: RedisCache;

  constructor() {
    this.cache = new RedisCache();
  }

  @Timing
  async getCharacters(page: number = 1): Promise<any[]> {
    const cacheKey = this.cache.generateKey('characters', { page });
    const cachedData = await this.cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/character?page=${page}`);
      const characters = response.data.results;
      
      await this.cache.set(cacheKey, characters);
      return characters;
    } catch (error) {
      console.error('Error fetching characters from Rick and Morty API:', error);
      throw error;
    }
  }

  @Timing
  async getCharacterById(id: number): Promise<any> {
    const cacheKey = this.cache.generateKey('character', { id });
    const cachedData = await this.cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const response = await axios.get(`${this.baseUrl}/character/${id}`);
      const character = response.data;
      
      await this.cache.set(cacheKey, character);
      return character;
    } catch (error) {
      console.error(`Error fetching character ${id} from Rick and Morty API:`, error);
      throw error;
    }
  }

  @Timing
  async searchCharacters(filters: {
    name?: string;
    status?: string;
    species?: string;
    gender?: string;
    origin?: string;
  }): Promise<any[]> {
    const cacheKey = this.cache.generateKey('characters_search', filters);
    const cachedData = await this.cache.get(cacheKey);

    if (cachedData) {
      return cachedData;
    }

    try {
      const queryParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      const response = await axios.get(`${this.baseUrl}/character/?${queryParams.toString()}`);
      const characters = response.data.results;
      
      await this.cache.set(cacheKey, characters);
      return characters;
    } catch (error) {
      console.error('Error searching characters in Rick and Morty API:', error);
      throw error;
    }
  }
} 