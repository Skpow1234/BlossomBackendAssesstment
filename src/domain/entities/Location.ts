export interface Location {
  id?: string;
  rickAndMortyId?: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
  url: string;
  created?: string;
  createdAt?: Date;
  updatedAt?: Date;
} 