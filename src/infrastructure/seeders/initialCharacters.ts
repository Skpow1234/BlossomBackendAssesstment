import axios from 'axios';
import { CharacterModel } from '../models/CharacterModel';
import { Logger } from '../utils/Logger';

const logger = new Logger('InitialCharactersSeeder');

/**
 * Seeds the database with 15 initial characters from the Rick and Morty API
 */
export const seedInitialCharacters = async (): Promise<void> => {
  try {
    // Check if we already have characters
    const count = await CharacterModel.count();
    
    if (count >= 15) {
      logger.info(`Database already contains ${count} characters. Skipping initial seeding.`);
      return;
    }
    
    logger.info('Starting initial character seeding...');
    
    // Fetch the first 15 characters from the Rick and Morty API
    const response = await axios.get('https://rickandmortyapi.com/api/character?page=1');
    const characters = response.data.results.slice(0, 15);
    
    // Map the API response to our model
    const characterData = characters.map((character: any) => ({
      rickAndMortyId: character.id,
      name: character.name,
      status: character.status,
      species: character.species,
      type: character.type || '',
      gender: character.gender,
      origin: typeof character.origin === 'object' ? character.origin.name : character.origin,
      location: typeof character.location === 'object' ? character.location.name : character.location,
      image: character.image,
      episode: character.episode,
      url: character.url,
      created: character.created
    }));
    
    // Create all characters at once
    await CharacterModel.bulkCreate(characterData);
    
    logger.info(`Successfully seeded ${characterData.length} characters.`);
  } catch (error) {
    logger.error('Error seeding initial characters', error);
    throw error;
  }
}; 