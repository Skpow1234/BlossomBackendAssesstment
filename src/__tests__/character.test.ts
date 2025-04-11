import { CharacterService } from '../domain/services/character/CharacterService';
import { CharacterRepository } from '../infrastructure/repositories/CharacterRepository';
import { RickAndMortyAPI } from '../infrastructure/external/RickAndMortyAPI';
import { RedisCache } from '../infrastructure/cache/RedisCache';

jest.mock('../infrastructure/repositories/CharacterRepository');
jest.mock('../infrastructure/external/RickAndMortyAPI');
jest.mock('../infrastructure/cache/RedisCache');

describe('CharacterService', () => {
  let characterService: CharacterService;
  let mockRepository: jest.Mocked<CharacterRepository>;
  let mockRickAndMortyAPI: jest.Mocked<RickAndMortyAPI>;
  let mockCache: jest.Mocked<RedisCache>;

  beforeEach(() => {
    mockRepository = new CharacterRepository() as jest.Mocked<CharacterRepository>;
    mockRickAndMortyAPI = new RickAndMortyAPI() as jest.Mocked<RickAndMortyAPI>;
    mockCache = new RedisCache() as jest.Mocked<RedisCache>;
    characterService = new CharacterServiceImpl(mockRepository);
  });

  describe('searchCharacters', () => {
    it('should search characters with filters', async () => {
      const filters = {
        name: 'Rick',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
      };

      const mockCharacters = [
        {
          id: '1',
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
        },
      ];

      mockRepository.search.mockResolvedValue(mockCharacters);

      const result = await characterService.searchCharacters(filters);

      expect(mockRepository.search).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockCharacters);
    });

    it('should handle empty filters', async () => {
      const mockCharacters = [
        {
          id: '1',
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
        },
      ];

      mockRepository.search.mockResolvedValue(mockCharacters);

      const result = await characterService.searchCharacters({});

      expect(mockRepository.search).toHaveBeenCalledWith({});
      expect(result).toEqual(mockCharacters);
    });

    it('should handle partial filters', async () => {
      const filters = {
        name: 'Rick',
      };

      const mockCharacters = [
        {
          id: '1',
          name: 'Rick Sanchez',
          status: 'Alive',
          species: 'Human',
          gender: 'Male',
        },
      ];

      mockRepository.search.mockResolvedValue(mockCharacters);

      const result = await characterService.searchCharacters(filters);

      expect(mockRepository.search).toHaveBeenCalledWith(filters);
      expect(result).toEqual(mockCharacters);
    });

    it('should handle errors during search', async () => {
      const filters = {
        name: 'Rick',
      };

      mockRepository.search.mockRejectedValue(new Error('Search failed'));

      await expect(characterService.searchCharacters(filters)).rejects.toThrow('Search failed');
    });
  });

  describe('syncCharacter', () => {
    it('should sync character from Rick and Morty API', async () => {
      const rickAndMortyCharacter = {
        id: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
      };

      const expectedCharacter = {
        rickAndMortyId: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
      };

      mockRepository.findByRickAndMortyId.mockResolvedValue(null);
      mockRepository.create.mockResolvedValue(expectedCharacter);

      const result = await characterService.syncCharacter(rickAndMortyCharacter);

      expect(mockRepository.findByRickAndMortyId).toHaveBeenCalledWith(1);
      expect(mockRepository.create).toHaveBeenCalledWith(expectedCharacter);
      expect(result).toEqual(expectedCharacter);
    });

    it('should update existing character', async () => {
      const rickAndMortyCharacter = {
        id: 1,
        name: 'Rick Sanchez Updated',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
      };

      const existingCharacter = {
        id: 'uuid-1',
        rickAndMortyId: 1,
        name: 'Rick Sanchez',
        status: 'Alive',
        species: 'Human',
        gender: 'Male',
        origin: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        location: { name: 'Earth', url: 'https://rickandmortyapi.com/api/location/1' },
        image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
        episode: ['https://rickandmortyapi.com/api/episode/1'],
        url: 'https://rickandmortyapi.com/api/character/1',
      };

      const updatedCharacter = {
        ...existingCharacter,
        name: 'Rick Sanchez Updated',
      };

      mockRepository.findByRickAndMortyId.mockResolvedValue(existingCharacter);
      mockRepository.update.mockResolvedValue(updatedCharacter);

      const result = await characterService.syncCharacter(rickAndMortyCharacter);

      expect(mockRepository.findByRickAndMortyId).toHaveBeenCalledWith(1);
      expect(mockRepository.update).toHaveBeenCalledWith('uuid-1', updatedCharacter);
      expect(result).toEqual(updatedCharacter);
    });
  });
}); 