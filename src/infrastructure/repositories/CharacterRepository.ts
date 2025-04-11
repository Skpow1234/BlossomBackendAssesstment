export interface CharacterRepository {
  findAll(): Promise<any[]>;
  findById(id: string): Promise<any>;
  create(character: any): Promise<any>;
  update(id: string, character: any): Promise<any>;
  delete(id: string): Promise<void>;
} 