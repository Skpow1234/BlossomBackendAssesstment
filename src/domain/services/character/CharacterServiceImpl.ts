import { CharacterService } from './CharacterService';
import { CharacterRepository } from '../../../infrastructure/repositories/CharacterRepository';

export class CharacterServiceImpl implements CharacterService {
  constructor(private readonly characterRepository: CharacterRepository) {}

  async getAllCharacters(): Promise<any[]> {
    return this.characterRepository.findAll();
  }

  async getCharacterById(id: string): Promise<any> {
    return this.characterRepository.findById(id);
  }

  async createCharacter(character: any): Promise<any> {
    return this.characterRepository.create(character);
  }

  async updateCharacter(id: string, character: any): Promise<any> {
    return this.characterRepository.update(id, character);
  }

  async deleteCharacter(id: string): Promise<void> {
    await this.characterRepository.delete(id);
  }
} 