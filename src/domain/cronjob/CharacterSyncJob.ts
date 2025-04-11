import { CronJob } from 'cron';
import { CharacterService } from '../services/character/CharacterService';
import { RickAndMortyAPI } from '../../infrastructure/external/RickAndMortyAPI';

export class CharacterSyncJob {
  private job: CronJob;
  private characterService: CharacterService;
  private rickAndMortyAPI: RickAndMortyAPI;

  constructor(characterService: CharacterService, rickAndMortyAPI: RickAndMortyAPI) {
    this.characterService = characterService;
    this.rickAndMortyAPI = rickAndMortyAPI;
    this.job = new CronJob('0 */12 * * *', this.syncCharacters.bind(this));
  }

  public start(): void {
    this.job.start();
    console.log('Character sync job started');
  }

  public stop(): void {
    this.job.stop();
    console.log('Character sync job stopped');
  }

  @Timing
  private async syncCharacters(): Promise<void> {
    try {
      console.log('Starting character synchronization...');
      const characters = await this.rickAndMortyAPI.getCharacters();
      
      for (const character of characters) {
        await this.characterService.syncCharacter(character);
      }

      console.log('Character synchronization completed successfully');
    } catch (error) {
      console.error('Error during character synchronization:', error);
    }
  }
} 