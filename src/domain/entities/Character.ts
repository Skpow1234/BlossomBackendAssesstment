export interface Character {
  id?: string;
  rickAndMortyId?: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: string | { name: string };
  location: string | { name: string };
  image: string;
  episode: string[];
  url: string;
  created?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 