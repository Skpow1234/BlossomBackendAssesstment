import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import swaggerUi from 'swagger-ui-express';
import { typeDefs } from './application/graphql/schema';
import { resolvers } from './application/graphql/resolvers';
import { requestLogger } from './application/middlewares/RequestLogger';
import sequelize from './config/database';
import dotenv from 'dotenv';
import swaggerSpec from './infrastructure/entry-points/api/swagger';
import { CharacterRepository } from './infrastructure/repositories/CharacterRepository';
import { RickAndMortyAPI } from './infrastructure/external/RickAndMortyAPI';
import { CharacterServiceImpl } from './domain/services/character/CharacterServiceImpl';
import { CharacterSyncJob } from './domain/cronjob/CharacterSyncJob';
import { seedInitialCharacters } from './infrastructure/seeders/initialCharacters';
import { errorHandler } from './application/middlewares/errorHandler';
import { CharacterController } from './infrastructure/entry-points/api/v1/character/character.controller';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// GraphQL configuration
const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production'
});

// REST API routes
// Character controller will be initialized in the initializeApp function

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP' });
});

// Error handler middleware
app.use(errorHandler);

const initializeApp = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');

    // Initialize database and seed data
    await sequelize.sync();
    await seedInitialCharacters();

    // Set up Apollo server
    await server.start();
    server.applyMiddleware({ app: app as any });

    // Start character synchronization job
    const characterRepository = new CharacterRepository();
    const rickAndMortyAPI = new RickAndMortyAPI();
    const characterService = new CharacterServiceImpl(characterRepository, rickAndMortyAPI);
    const characterSyncJob = new CharacterSyncJob(characterRepository, rickAndMortyAPI);
    
    // Set up REST API controllers
    const characterController = new CharacterController(characterService);
    app.use('/api/characters', characterController.getRouter());

    // Initial sync
    await characterSyncJob.run();

    // Start the server
    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
      console.log(`GraphQL endpoint: http://localhost:${port}${server.graphqlPath}`);
      console.log(`API Documentation: http://localhost:${port}/api-docs`);
    });
  } catch (error) {
    console.error('Unable to start application:', error);
  }
};

initializeApp(); 