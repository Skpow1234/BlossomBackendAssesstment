import { CharacterService } from '../../domain/services/character/CharacterService';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

export const createResolvers = (characterService: CharacterService) => ({
  Query: {
    characters: async () => {
      return characterService.getAllCharacters();
    },
    character: async (_: any, { id }: { id: string }) => {
      return characterService.getCharacterById(id);
    },
  },
  Mutation: {
    createCharacter: async (_: any, { input }: { input: any }) => {
      const character = await characterService.createCharacter(input);
      await pubsub.publish('CHARACTER_CREATED', { characterCreated: character });
      return character;
    },
    updateCharacter: async (_: any, { id, input }: { id: string; input: any }) => {
      const character = await characterService.updateCharacter(id, input);
      if (character) {
        await pubsub.publish('CHARACTER_UPDATED', { characterUpdated: character });
      }
      return character;
    },
    deleteCharacter: async (_: any, { id }: { id: string }) => {
      await characterService.deleteCharacter(id);
      await pubsub.publish('CHARACTER_DELETED', { characterDeleted: id });
      return true;
    },
  },
  Subscription: {
    characterCreated: {
      subscribe: () => pubsub.asyncIterator(['CHARACTER_CREATED']),
    },
    characterUpdated: {
      subscribe: () => pubsub.asyncIterator(['CHARACTER_UPDATED']),
    },
    characterDeleted: {
      subscribe: () => pubsub.asyncIterator(['CHARACTER_DELETED']),
    },
  },
}); 