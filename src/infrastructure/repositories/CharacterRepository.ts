import { Character } from '../../domain/entities/Character';
import { Logger } from '../utils/Logger';
import { CharacterModel } from '../models/CharacterModel';
import { Op } from 'sequelize';

export interface CharacterFilter {
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
  origin?: string;
  location?: string;
}

export interface ICharacterRepository {
  findAll(): Promise<Character[]>;
  findById(id: number): Promise<Character | null>;
  findByRickAndMortyId(id: number): Promise<Character | null>;
  search(query: string): Promise<Character[]>;
  filterCharacters(filters: CharacterFilter): Promise<Character[]>;
  create(character: Partial<Character>): Promise<Character>;
  update(id: number, character: Partial<Character>): Promise<[number, Character[]]>;
  delete(id: number): Promise<number>;
}

export class CharacterRepository implements ICharacterRepository {
  private logger: Logger;

  constructor() {
    this.logger = new Logger('CharacterRepository');
  }

  async findAll(): Promise<Character[]> {
    try {
      const characters = await CharacterModel.findAll();
      return characters.map(this.mapToCharacter);
    } catch (error) {
      this.logger.error('Error fetching all characters', error);
      throw error;
    }
  }

  async findById(id: number): Promise<Character | null> {
    try {
      const character = await CharacterModel.findByPk(id.toString());
      return character ? this.mapToCharacter(character) : null;
    } catch (error) {
      this.logger.error(`Error fetching character with id ${id}`, error);
      throw error;
    }
  }

  async findByRickAndMortyId(rickAndMortyId: number): Promise<Character | null> {
    try {
      const character = await CharacterModel.findOne({
        where: { rickAndMortyId }
      });
      return character ? this.mapToCharacter(character) : null;
    } catch (error) {
      this.logger.error(`Error fetching character with Rick and Morty ID ${rickAndMortyId}`, error);
      throw error;
    }
  }

  async search(query: string): Promise<Character[]> {
    try {
      const characters = await CharacterModel.findAll({
        where: {
          name: {
            [Op.like]: `%${query}%`
          }
        }
      });
      return characters.map(this.mapToCharacter);
    } catch (error) {
      this.logger.error(`Error searching characters with query ${query}`, error);
      throw error;
    }
  }

  async filterCharacters(filters: CharacterFilter): Promise<Character[]> {
    try {
      const where: any = {};
      if (filters.status) where.status = filters.status;
      if (filters.species) where.species = filters.species;
      if (filters.type) where.type = filters.type;
      if (filters.gender) where.gender = filters.gender;
      if (filters.origin) where.origin = filters.origin;
      if (filters.location) where.location = filters.location;

      const characters = await CharacterModel.findAll({ where });
      return characters.map(this.mapToCharacter);
    } catch (error) {
      this.logger.error('Error filtering characters', error);
      throw error;
    }
  }

  async create(character: Partial<Character>): Promise<Character> {
    try {
      const createdCharacter = await CharacterModel.create(character);
      return this.mapToCharacter(createdCharacter);
    } catch (error) {
      this.logger.error('Error creating character', error);
      throw error;
    }
  }

  async update(id: number, character: Partial<Character>): Promise<[number, Character[]]> {
    try {
      const [affectedCount] = await CharacterModel.update(character, {
        where: { id: id.toString() }
      });
      
      const updatedCharacters = await CharacterModel.findAll({
        where: { id: id.toString() }
      });
      
      return [affectedCount, updatedCharacters.map(this.mapToCharacter)];
    } catch (error) {
      this.logger.error(`Error updating character with id ${id}`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<number> {
    try {
      const affectedCount = await CharacterModel.destroy({
        where: { id: id.toString() }
      });
      return affectedCount;
    } catch (error) {
      this.logger.error(`Error deleting character with id ${id}`, error);
      throw error;
    }
  }

  private mapToCharacter(model: CharacterModel): Character {
    return {
      id: model.id,
      rickAndMortyId: model.rickAndMortyId,
      name: model.name,
      status: model.status,
      species: model.species,
      type: model.type,
      gender: model.gender,
      origin: model.origin,
      location: model.location,
      image: model.image,
      episode: model.episode,
      url: model.url,
      created: model.created,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt
    };
  }
} 