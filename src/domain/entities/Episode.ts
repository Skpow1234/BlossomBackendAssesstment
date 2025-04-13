export interface Episode {
  id?: string;
  rickAndMortyId?: number;
  name: string;
  airDate: string;
  episode: string;
  characters: string[];
  url: string;
  created?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 