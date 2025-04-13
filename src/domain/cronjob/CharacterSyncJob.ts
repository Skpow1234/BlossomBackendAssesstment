import { ICharacterRepository } from '../../infrastructure/repositories/CharacterRepository';
import { RickAndMortyAPI } from '../../infrastructure/external/RickAndMortyAPI';
import { Logger } from '../../infrastructure/utils/Logger';

export class CharacterSyncJob {
  private characterRepository: ICharacterRepository;
  private rickAndMortyAPI: RickAndMortyAPI;
  private logger: Logger;

  constructor(characterRepository: ICharacterRepository, rickAndMortyAPI: RickAndMortyAPI) {
    this.characterRepository = characterRepository;
    this.rickAndMortyAPI = rickAndMortyAPI;
    this.logger = new Logger('CharacterSyncJob');
  }

  async run(): Promise<void> {
    try {
      this.logger.info('Running character sync job');
      
      const characters = await this.rickAndMortyAPI.getAllCharacters();
      
      for (const character of characters) {
        try {
          if (character.rickAndMortyId) {
            const existingCharacter = await this.characterRepository.findByRickAndMortyId(character.rickAndMortyId);
            
            if (!existingCharacter) {
              await this.characterRepository.create({
                rickAndMortyId: character.rickAndMortyId,
                name: character.name,
                status: character.status,
                species: character.species,
                type: character.type,
                gender: character.gender,
                origin: typeof character.origin === 'object' ? character.origin.name : character.origin,
                location: typeof character.location === 'object' ? character.location.name : character.location,
                image: character.image,
                episode: character.episode,
                url: character.url
              });
              
              this.logger.info(`Character ${character.name} synced successfully`);
            }
          }
        } catch (error) {
          this.logger.error(`Error syncing character ${character.name}`, error);
        }
      }
      
      this.logger.info('Character sync job completed');
    } catch (error) {
      this.logger.error('Error running character sync job', error);
    }
  }
} 