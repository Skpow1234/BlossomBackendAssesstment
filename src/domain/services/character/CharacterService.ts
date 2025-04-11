export interface CharacterService {
  getAllCharacters(): Promise<any[]>;
  getCharacterById(id: string): Promise<any>;
  createCharacter(character: any): Promise<any>;
  updateCharacter(id: string, character: any): Promise<any>;
  deleteCharacter(id: string): Promise<void>;
} 