import { QueryInterface } from 'sequelize';
import fetch from 'node-fetch';

export async function up(queryInterface: QueryInterface) {
  try {
    // Fetch first 15 characters from Rick and Morty API
    const response = await fetch('https://rickandmortyapi.com/api/character/1,2,3,4,5,6,7,8,9,10,11,12,13,14,15');
    const characters = await response.json();

    const formattedCharacters = characters.map((char: any) => ({
      id: char.id,
      name: char.name,
      status: char.status,
      species: char.species,
      type: char.type,
      gender: char.gender,
      origin: char.origin.name,
      location: char.location.name,
      image: char.image,
      episode: char.episode,
      url: char.url,
      created: char.created
    }));

    await queryInterface.bulkInsert('characters', formattedCharacters);
  } catch (error) {
    console.error('Error seeding characters:', error);
  }
}

export async function down(queryInterface: QueryInterface) {
  await queryInterface.bulkDelete('characters', {});
} 