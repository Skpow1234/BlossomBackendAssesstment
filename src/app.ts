import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import swaggerUi from 'swagger-ui-express';
import { typeDefs } from './graphql/schema';
import { resolvers } from './graphql/resolvers';
import { requestLogger } from './middleware/requestLogger';
import { startUpdateCron } from './cron/updateCharacters';
import sequelize from './config/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(requestLogger);

// Swagger documentation
const swaggerDocument = {
  openapi: '3.0.0',
  info: {
    title: 'Rick and Morty API',
    version: '1.0.0',
    description: 'API for searching Rick and Morty characters'
  },
  paths: {
    '/graphql': {
      post: {
        tags: ['GraphQL'],
        description: 'GraphQL endpoint',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    example: `
                      query {
                        characters(filter: { status: "Alive", species: "Human" }) {
                          id
                          name
                          status
                          species
                        }
                      }
                    `
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Apollo Server setup
async function startApolloServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  await server.start();
  server.applyMiddleware({ app: app as any });

  // Database connection
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    await sequelize.sync();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  // Start cron job
  startUpdateCron();

  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/graphql`);
    console.log(`API documentation: http://localhost:${port}/api-docs`);
  });
}

startApolloServer().catch(console.error); 