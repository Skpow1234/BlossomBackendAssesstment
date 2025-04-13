import { Character } from '../../../domain/entities/Character';

export interface CharacterService {
  getAllCharacters(): Promise<Character[]>;
  getCharacterById(id: string): Promise<Character | null>;
  searchCharacters(query: string): Promise<Character[]>;
  syncCharacter(rickAndMortyId: number): Promise<Character>;
  updateCharacter(id: number, character: Partial<Character>): Promise<[number, Character[]]>;
  deleteCharacter(id: number): Promise<void>;
} 