import { gql } from 'apollo-server-express';

export const typeDefs = gql`
  type Character {
    id: ID!
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
    created: String!
  }

  input CharacterFilter {
    status: String
    species: String
    gender: String
    name: String
    origin: String
  }

  type Query {
    characters(filter: CharacterFilter): [Character!]!
    character(id: ID!): Character
  }
`;

export default typeDefs; 