import { Op } from 'sequelize';
import Character from '../models/Character';
import redisClient from '../config/redis';
import { measureExecutionTime } from '../decorators/measureExecutionTime';

interface CharacterFilter {
  status?: string;
  species?: string;
  gender?: string;
  name?: string;
  origin?: string;
}

class CharacterResolver {
  @measureExecutionTime()
  async characters(_: any, { filter = {} }: { filter?: CharacterFilter }) {
    const cacheKey = `characters:${JSON.stringify(filter)}`;
    
    // Try to get from cache
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    // Build filter conditions
    const where: any = {};
    if (filter?.status) where.status = filter.status;
    if (filter?.species) where.species = filter.species;
    if (filter?.gender) where.gender = filter.gender;
    if (filter?.name) where.name = { [Op.like]: `%${filter.name}%` };
    if (filter?.origin) where.origin = { [Op.like]: `%${filter.origin}%` };

    // Query database
    const characters = await Character.findAll({ where });
    
    // Cache the result
    await redisClient.set(cacheKey, JSON.stringify(characters), {
      EX: 3600 // Cache for 1 hour
    });

    return characters;
  }

  @measureExecutionTime()
  async character(_: any, { id }: { id: string }) {
    const cacheKey = `character:${id}`;
    
    // Try to get from cache
    const cachedResult = await redisClient.get(cacheKey);
    if (cachedResult) {
      return JSON.parse(cachedResult);
    }

    // Query database
    const character = await Character.findByPk(id);
    
    if (character) {
      // Cache the result
      await redisClient.set(cacheKey, JSON.stringify(character), {
        EX: 3600 // Cache for 1 hour
      });
    }

    return character;
  }
}

export const resolvers = {
  Query: {
    characters: (_: any, args: { filter?: CharacterFilter }) => new CharacterResolver().characters(_, args),
    character: (_: any, args: { id: string }) => new CharacterResolver().character(_, args)
  }
}; 