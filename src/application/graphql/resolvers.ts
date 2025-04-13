import { PubSub } from 'graphql-subscriptions';
import { CharacterServiceImpl } from '../../domain/services/character/CharacterServiceImpl';
import { CharacterRepository } from '../../infrastructure/repositories/CharacterRepository';
import { RickAndMortyAPI } from '../../infrastructure/external/RickAndMortyAPI';
import { Timing } from '../../domain/decorators/Timing';
import { Logger } from '../../infrastructure/utils/Logger';
import { RedisCache } from '../../infrastructure/cache/RedisCache';

// Initialize services
const characterRepository = new CharacterRepository();
const rickAndMortyAPI = new RickAndMortyAPI();
const characterService = new CharacterServiceImpl(characterRepository, rickAndMortyAPI);
const pubsub = new PubSub();
const logger = new Logger('GraphQLResolvers');
const cache = new RedisCache('localhost', 6379);

// Events
const CHARACTER_CREATED = 'CHARACTER_CREATED';
const CHARACTER_UPDATED = 'CHARACTER_UPDATED';
const CHARACTER_DELETED = 'CHARACTER_DELETED';

export const resolvers = {
  Query: {
    // Character queries
    characters: async (_: any, { filter }: { filter: any }) => {
      const cacheKey = cache.generateKey('graphql:characters', filter || {});
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        logger.info(`Cache hit for characters with filter: ${JSON.stringify(filter)}`);
        return JSON.parse(cachedData);
      }
      
      logger.info(`Cache miss for characters with filter: ${JSON.stringify(filter)}`);
      const characters = await characterRepository.filterCharacters(filter || {});
      
      await cache.set(cacheKey, JSON.stringify(characters), 3600);
      return characters;
    },
    
    character: async (_: any, { id }: { id: string }) => {
      const cacheKey = cache.generateKey('graphql:character', { id });
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        logger.info(`Cache hit for character with id: ${id}`);
        return JSON.parse(cachedData);
      }
      
      logger.info(`Cache miss for character with id: ${id}`);
      const character = await characterRepository.findById(parseInt(id));
      
      if (character) {
        await cache.set(cacheKey, JSON.stringify(character), 3600);
      }
      
      return character;
    },
    
    characterByRickAndMortyId: async (_: any, { id }: { id: number }) => {
      const cacheKey = cache.generateKey('graphql:characterByRickAndMortyId', { id });
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        logger.info(`Cache hit for character with Rick & Morty ID: ${id}`);
        return JSON.parse(cachedData);
      }
      
      logger.info(`Cache miss for character with Rick & Morty ID: ${id}`);
      const character = await characterRepository.findByRickAndMortyId(id);
      
      if (character) {
        await cache.set(cacheKey, JSON.stringify(character), 3600);
      }
      
      return character;
    },
    
    searchCharacters: async (_: any, { query }: { query: string }) => {
      const cacheKey = cache.generateKey('graphql:searchCharacters', { query });
      const cachedData = await cache.get(cacheKey);
      
      if (cachedData) {
        logger.info(`Cache hit for searchCharacters with query: ${query}`);
        return JSON.parse(cachedData);
      }
      
      logger.info(`Cache miss for searchCharacters with query: ${query}`);
      const characters = await characterRepository.search(query);
      
      await cache.set(cacheKey, JSON.stringify(characters), 3600);
      return characters;
    },
    
    // Location queries would be implemented here
    
    // Episode queries would be implemented here
  },
  
  Mutation: {
    syncCharacter: async (_: any, { id }: { id: number }) => {
      try {
        const character = await characterService.syncCharacter(id);
        pubsub.publish(CHARACTER_UPDATED, { characterUpdated: character });
        return character;
      } catch (error) {
        logger.error(`Error syncing character with id ${id}`, error);
        throw new Error(`Failed to sync character: ${(error as Error).message}`);
      }
    },
    
    createCharacter: async (_: any, characterData: any) => {
      try {
        const character = await characterRepository.create(characterData);
        pubsub.publish(CHARACTER_CREATED, { characterCreated: character });
        return character;
      } catch (error) {
        logger.error('Error creating character', error);
        throw new Error(`Failed to create character: ${(error as Error).message}`);
      }
    },
    
    updateCharacter: async (_: any, { id, ...characterData }: { id: string, [key: string]: any }) => {
      try {
        const [, [updatedCharacter]] = await characterRepository.update(parseInt(id), characterData);
        
        if (updatedCharacter) {
          pubsub.publish(CHARACTER_UPDATED, { characterUpdated: updatedCharacter });
          
          // Invalidate cache
          const cacheKey = cache.generateKey('graphql:character', { id });
          await cache.delete(cacheKey);
          
          return updatedCharacter;
        }
        
        return null;
      } catch (error) {
        logger.error(`Error updating character with id ${id}`, error);
        throw new Error(`Failed to update character: ${(error as Error).message}`);
      }
    },
    
    deleteCharacter: async (_: any, { id }: { id: string }) => {
      try {
        const affectedCount = await characterRepository.delete(parseInt(id));
        
        if (affectedCount > 0) {
          pubsub.publish(CHARACTER_DELETED, { characterDeleted: id });
          
          // Invalidate cache
          const cacheKey = cache.generateKey('graphql:character', { id });
          await cache.delete(cacheKey);
          
          return true;
        }
        
        return false;
      } catch (error) {
        logger.error(`Error deleting character with id ${id}`, error);
        throw new Error(`Failed to delete character: ${(error as Error).message}`);
      }
    },
    
    syncAllCharacters: async () => {
      try {
        const characters = await rickAndMortyAPI.getAllCharacters();
        let syncedCount = 0;
        
        for (const character of characters) {
          try {
            if (character.rickAndMortyId) {
              await characterService.syncCharacter(character.rickAndMortyId);
              syncedCount++;
            }
          } catch (error) {
            logger.error(`Error syncing character ${character.name}`, error);
          }
        }
        
        // Invalidate cache
        await cache.delete(cache.generateKey('graphql:characters', {}));
        
        return syncedCount;
      } catch (error) {
        logger.error('Error syncing all characters', error);
        throw new Error(`Failed to sync all characters: ${(error as Error).message}`);
      }
    },
    
    // Other sync mutations would be implemented here
  },
  
  Subscription: {
    characterCreated: {
      subscribe: () => pubsub.asyncIterator([CHARACTER_CREATED])
    },
    characterUpdated: {
      subscribe: () => pubsub.asyncIterator([CHARACTER_UPDATED])
    },
    characterDeleted: {
      subscribe: () => pubsub.asyncIterator([CHARACTER_DELETED])
    }
  }
}; 