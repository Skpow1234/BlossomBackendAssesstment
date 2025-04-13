import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Character {
    id: ID!
    rickAndMortyId: Int
    name: String!
    status: String!
    species: String!
    type: String
    gender: String!
    origin: String!
    location: String!
    image: String!
    episode: [String!]!
    url: String!
    created: String
    createdAt: String
    updatedAt: String
  }

  type Location {
    id: ID!
    rickAndMortyId: Int
    name: String!
    type: String!
    dimension: String!
    residents: [String!]!
    url: String!
    created: String
    createdAt: String
    updatedAt: String
  }

  type Episode {
    id: ID!
    rickAndMortyId: Int
    name: String!
    airDate: String!
    episode: String!
    characters: [String!]!
    url: String!
    created: String
    createdAt: String
    updatedAt: String
  }

  input CharacterFilter {
    name: String
    status: String
    species: String
    type: String
    gender: String
    origin: String
    location: String
  }

  input LocationFilter {
    name: String
    type: String
    dimension: String
  }

  input EpisodeFilter {
    name: String
    episode: String
  }

  type Query {
    # Character queries
    characters(filter: CharacterFilter): [Character!]!
    character(id: ID!): Character
    characterByRickAndMortyId(id: Int!): Character
    searchCharacters(query: String!): [Character!]!
    
    # Location queries
    locations(filter: LocationFilter): [Location!]!
    location(id: ID!): Location
    locationByRickAndMortyId(id: Int!): Location
    
    # Episode queries
    episodes(filter: EpisodeFilter): [Episode!]!
    episode(id: ID!): Episode
    episodeByRickAndMortyId(id: Int!): Episode
  }

  type Mutation {
    # Character mutations
    syncCharacter(id: Int!): Character!
    createCharacter(
      name: String!
      status: String!
      species: String!
      type: String
      gender: String!
      origin: String!
      location: String!
      image: String!
      episode: [String!]!
      url: String!
    ): Character!
    
    updateCharacter(
      id: ID!
      name: String
      status: String
      species: String
      type: String
      gender: String
      origin: String
      location: String
      image: String
      episode: [String]
      url: String
    ): Character
    
    deleteCharacter(id: ID!): Boolean!
    
    # Syncronization mutations
    syncAllCharacters: Int!
    syncAllLocations: Int!
    syncAllEpisodes: Int!
  }

  type Subscription {
    characterCreated: Character!
    characterUpdated: Character!
    characterDeleted: ID!
  }
`; 