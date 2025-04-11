import cron from 'node-cron';
import Character from '../models/Character';
import fetch from 'node-fetch';

async function updateCharacters() {
  try {
    const characters = await Character.findAll();
    
    for (const character of characters) {
      const response = await fetch(`https://rickandmortyapi.com/api/character/${character.id}`);
      const apiCharacter = await response.json();
      
      if (response.ok) {
        await Character.update(
          {
            name: apiCharacter.name,
            status: apiCharacter.status,
            species: apiCharacter.species,
            type: apiCharacter.type,
            gender: apiCharacter.gender,
            origin: apiCharacter.origin.name,
            location: apiCharacter.location.name,
            image: apiCharacter.image,
            episode: apiCharacter.episode,
            url: apiCharacter.url,
            created: apiCharacter.created
          },
          {
            where: { id: character.id }
          }
        );
      }
    }
    console.log('Characters updated successfully');
  } catch (error) {
    console.error('Error updating characters:', error);
  }
}

// Run every 12 hours
export const startUpdateCron = () => {
  cron.schedule('0 */12 * * *', updateCharacters);
}; 