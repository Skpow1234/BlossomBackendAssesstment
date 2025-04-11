import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Location {
    name: String!
    url: String!
  }

  type Character {
    id: ID!
    rickAndMortyId: Int!
    name: String!
    status: String!
    species: String!
    type: String
    gender: String!
    origin: Location!
    location: Location!
    image: String!
    episode: [String!]!
    url: String!
    createdAt: String!
    updatedAt: String!
  }

  input CharacterFilter {
    name: String
    status: String
    species: String
    gender: String
    origin: String
  }

  type Query {
    characters(filter: CharacterFilter): [Character!]!
    character(id: ID!): Character
    characterByRickAndMortyId(id: Int!): Character
  }

  type Mutation {
    syncCharacters: Boolean!
  }

  type Subscription {
    characterCreated: Character!
    characterUpdated: Character!
    characterDeleted: ID!
  }
`; 