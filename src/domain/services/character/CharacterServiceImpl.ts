import { Character } from '../../entities/Character';
import { ICharacterRepository } from '../../../infrastructure/repositories/CharacterRepository';
import { RickAndMortyAPI } from '../../../infrastructure/external/RickAndMortyAPI';
import { Logger } from '../../../infrastructure/utils/Logger';
import { NotFoundError } from '../../errors/NotFoundError';

export interface CharacterService {
  getAllCharacters(): Promise<Character[]>;
  getCharacterById(id: string): Promise<Character | null>;
  searchCharacters(query: string): Promise<Character[]>;
  syncCharacter(rickAndMortyId: number): Promise<Character>;
  updateCharacter(id: number, character: Partial<Character>): Promise<[number, Character[]]>;
  deleteCharacter(id: number): Promise<void>;
}

export class CharacterServiceImpl implements CharacterService {
  private characterRepository: ICharacterRepository;
  private rickAndMortyAPI: RickAndMortyAPI;
  private logger: Logger;

  constructor(
    characterRepository: ICharacterRepository,
    rickAndMortyAPI: RickAndMortyAPI
  ) {
    this.characterRepository = characterRepository;
    this.rickAndMortyAPI = rickAndMortyAPI;
    this.logger = new Logger('CharacterService');
  }

  async getAllCharacters(): Promise<Character[]> {
    try {
      return await this.characterRepository.findAll();
    } catch (error) {
      this.logger.error('Error getting all characters', error);
      throw new Error('Failed to get characters');
    }
  }

  async getCharacterById(id: string): Promise<Character | null> {
    try {
      return await this.characterRepository.findById(parseInt(id));
    } catch (error) {
      this.logger.error(`Error getting character by id ${id}`, error);
      throw new Error(`Failed to get character with id ${id}`);
    }
  }

  async searchCharacters(query: string): Promise<Character[]> {
    try {
      return await this.characterRepository.search(query);
    } catch (error) {
      this.logger.error(`Error searching characters with query ${query}`, error);
      throw new Error(`Failed to search characters with query ${query}`);
    }
  }

  async syncCharacter(rickAndMortyId: number): Promise<Character> {
    try {
      // Get character data from Rick and Morty API
      const apiCharacter = await this.rickAndMortyAPI.getCharacter(rickAndMortyId);
      
      if (!apiCharacter) {
        throw new NotFoundError(`Character with Rick and Morty ID ${rickAndMortyId} not found`);
      }
      
      // Check if the character already exists in our database
      const existingCharacter = await this.characterRepository.findByRickAndMortyId(rickAndMortyId);
      
      if (existingCharacter) {
        // Update the existing character
        const [, updatedCharacters] = await this.characterRepository.update(
          parseInt(existingCharacter.id as string), 
          apiCharacter
        );
        return updatedCharacters[0];
      } else {
        // Create a new character
        return await this.characterRepository.create(apiCharacter);
      }
    } catch (error) {
      this.logger.error(`Error syncing character with Rick and Morty ID ${rickAndMortyId}`, error);
      throw error;
    }
  }

  async updateCharacter(id: number, character: Partial<Character>): Promise<[number, Character[]]> {
    try {
      return await this.characterRepository.update(id, character);
    } catch (error) {
      this.logger.error(`Error updating character with id ${id}`, error);
      throw error;
    }
  }

  async deleteCharacter(id: number): Promise<void> {
    try {
      await this.characterRepository.delete(id);
    } catch (error) {
      this.logger.error(`Error deleting character with id ${id}`, error);
      throw error;
    }
  }
} 