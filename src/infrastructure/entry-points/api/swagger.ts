import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rick and Morty Character API',
      version: '1.0.0',
      description: 'API for searching and managing Rick and Morty characters',
      contact: {
        name: 'API Support',
        email: 'support@blossom.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server',
      },
      {
        url: 'https://api.blossom.com',
        description: 'Production server',
      },
    ],
    components: {
      schemas: {
        Character: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'The character ID',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            rickAndMortyId: {
              type: 'integer',
              description: 'The character ID from Rick and Morty API',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'The character name',
              example: 'Rick Sanchez',
            },
            status: {
              type: 'string',
              enum: ['Alive', 'Dead', 'unknown'],
              description: 'The character status',
              example: 'Alive',
            },
            species: {
              type: 'string',
              description: 'The character species',
              example: 'Human',
            },
            type: {
              type: 'string',
              description: 'The character type',
              example: 'Human',
            },
            gender: {
              type: 'string',
              enum: ['Female', 'Male', 'Genderless', 'unknown'],
              description: 'The character gender',
              example: 'Male',
            },
            origin: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Earth',
                },
                url: {
                  type: 'string',
                  example: 'https://rickandmortyapi.com/api/location/1',
                },
              },
            },
            location: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  example: 'Earth',
                },
                url: {
                  type: 'string',
                  example: 'https://rickandmortyapi.com/api/location/1',
                },
              },
            },
            image: {
              type: 'string',
              format: 'uri',
              description: 'URL to the character image',
              example: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            },
            episode: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uri',
              },
              description: 'List of episodes the character appeared in',
              example: ['https://rickandmortyapi.com/api/episode/1'],
            },
            url: {
              type: 'string',
              format: 'uri',
              description: 'URL to the character details',
              example: 'https://rickandmortyapi.com/api/character/1',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Creation timestamp',
              example: '2024-02-19T12:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Last update timestamp',
              example: '2024-02-19T12:00:00Z',
            },
          },
          required: ['name', 'status', 'species', 'gender', 'origin', 'location', 'image', 'episode', 'url'],
        },
        CharacterFilter: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Filter by character name',
              example: 'Rick',
            },
            status: {
              type: 'string',
              enum: ['Alive', 'Dead', 'unknown'],
              description: 'Filter by character status',
              example: 'Alive',
            },
            species: {
              type: 'string',
              description: 'Filter by character species',
              example: 'Human',
            },
            gender: {
              type: 'string',
              enum: ['Female', 'Male', 'Genderless', 'unknown'],
              description: 'Filter by character gender',
              example: 'Male',
            },
            origin: {
              type: 'string',
              description: 'Filter by character origin',
              example: 'Earth',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              description: 'Error status',
              example: 'error',
            },
            message: {
              type: 'string',
              description: 'Error message',
              example: 'Character not found',
            },
            code: {
              type: 'string',
              description: 'Error code',
              example: 'NOT_FOUND',
            },
            details: {
              type: 'object',
              description: 'Additional error details',
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
        apiKey: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for external services',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Authentication failed',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
        ValidationError: {
          description: 'Invalid input data',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Characters',
        description: 'Character management endpoints',
      },
      {
        name: 'Authentication',
        description: 'Authentication and authorization endpoints',
      },
    ],
  },
  apis: ['./src/infrastructure/entry-points/api/v1/character/*.ts'],
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Rick and Morty Character API Documentation',
  }));
}; 