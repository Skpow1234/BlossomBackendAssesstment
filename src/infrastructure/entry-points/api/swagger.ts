import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Rick and Morty Character API',
      version: '1.0.0',
      description: 'API for searching and managing Rick and Morty characters with caching',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: '{protocol}://{hostname}:{port}',
        variables: {
          protocol: {
            enum: ['http', 'https'],
            default: 'http'
          },
          hostname: {
            default: 'localhost'
          },
          port: {
            default: '3000'
          }
        }
      }
    ],
    tags: [
      {
        name: 'Characters',
        description: 'API endpoints for character management'
      },
      {
        name: 'Locations',
        description: 'API endpoints for location management'
      },
      {
        name: 'Episodes',
        description: 'API endpoints for episode management'
      },
      {
        name: 'Health',
        description: 'API health check'
      }
    ],
    components: {
      schemas: {
        Character: {
          type: 'object',
          required: ['name', 'status', 'species', 'gender', 'origin', 'location', 'image', 'episode', 'url'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Unique identifier for the character'
            },
            rickAndMortyId: {
              type: 'integer',
              description: 'Original ID from the Rick and Morty API'
            },
            name: {
              type: 'string',
              example: 'Rick Sanchez'
            },
            status: {
              type: 'string',
              enum: ['Alive', 'Dead', 'unknown'],
              example: 'Alive'
            },
            species: {
              type: 'string',
              example: 'Human'
            },
            type: {
              type: 'string',
              example: ''
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Genderless', 'unknown'],
              example: 'Male'
            },
            origin: {
              type: 'string',
              example: 'Earth'
            },
            location: {
              type: 'string',
              example: 'Earth'
            },
            image: {
              type: 'string',
              format: 'uri',
              example: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg'
            },
            episode: {
              type: 'array',
              items: {
                type: 'string'
              },
              example: ['https://rickandmortyapi.com/api/episode/1']
            },
            url: {
              type: 'string',
              format: 'uri',
              example: 'https://rickandmortyapi.com/api/character/1'
            },
            created: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Location: {
          type: 'object',
          required: ['name', 'type', 'dimension', 'residents', 'url'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            rickAndMortyId: {
              type: 'integer'
            },
            name: {
              type: 'string',
              example: 'Earth'
            },
            type: {
              type: 'string',
              example: 'Planet'
            },
            dimension: {
              type: 'string',
              example: 'Dimension C-137'
            },
            residents: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            url: {
              type: 'string',
              format: 'uri'
            },
            created: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Episode: {
          type: 'object',
          required: ['name', 'airDate', 'episode', 'characters', 'url'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid'
            },
            rickAndMortyId: {
              type: 'integer'
            },
            name: {
              type: 'string',
              example: 'Pilot'
            },
            airDate: {
              type: 'string',
              example: 'December 2, 2013'
            },
            episode: {
              type: 'string',
              example: 'S01E01'
            },
            characters: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            url: {
              type: 'string',
              format: 'uri'
            },
            created: {
              type: 'string',
              format: 'date-time'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            },
            updatedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        CharacterFilter: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
              description: 'Filter by name'
            },
            status: {
              type: 'string',
              enum: ['Alive', 'Dead', 'unknown'],
              description: 'Filter by status'
            },
            species: {
              type: 'string',
              description: 'Filter by species'
            },
            type: {
              type: 'string',
              description: 'Filter by type'
            },
            gender: {
              type: 'string',
              enum: ['Male', 'Female', 'Genderless', 'unknown'],
              description: 'Filter by gender'
            },
            origin: {
              type: 'string',
              description: 'Filter by origin'
            },
            location: {
              type: 'string',
              description: 'Filter by location'
            }
          }
        },
        Error: {
          type: 'object',
          required: ['status', 'errorCode', 'message'],
          properties: {
            status: {
              type: 'string',
              example: 'error'
            },
            errorCode: {
              type: 'string',
              example: 'VALIDATION_ERROR'
            },
            message: {
              type: 'string',
              example: 'Validation failed'
            },
            details: {
              type: 'object',
              additionalProperties: true
            }
          }
        }
      },
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-KEY'
        }
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                status: 'error',
                errorCode: 'UNAUTHORIZED',
                message: 'Authentication is required to access this resource'
              }
            }
          }
        },
        NotFoundError: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                status: 'error',
                errorCode: 'NOT_FOUND',
                message: 'Requested resource could not be found'
              }
            }
          }
        },
        ValidationError: {
          description: 'Validation error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                status: 'error',
                errorCode: 'VALIDATION_ERROR',
                message: 'Validation failed',
                details: {
                  errors: [
                    {
                      field: 'name',
                      message: 'Name is required',
                      value: null
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    paths: {
      '/api/characters': {
        get: {
          tags: ['Characters'],
          summary: 'Get all characters',
          description: 'Returns a list of all characters. Supports pagination and filtering.',
          parameters: [
            {
              name: 'page',
              in: 'query',
              description: 'Page number',
              schema: {
                type: 'integer',
                default: 1
              }
            },
            {
              name: 'limit',
              in: 'query',
              description: 'Number of items per page',
              schema: {
                type: 'integer',
                default: 20
              }
            },
            {
              name: 'name',
              in: 'query',
              description: 'Filter by name',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'status',
              in: 'query',
              description: 'Filter by status',
              schema: {
                type: 'string',
                enum: ['Alive', 'Dead', 'unknown']
              }
            },
            {
              name: 'species',
              in: 'query',
              description: 'Filter by species',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'type',
              in: 'query',
              description: 'Filter by type',
              schema: {
                type: 'string'
              }
            },
            {
              name: 'gender',
              in: 'query',
              description: 'Filter by gender',
              schema: {
                type: 'string',
                enum: ['Male', 'Female', 'Genderless', 'unknown']
              }
            }
          ],
          responses: {
            '200': {
              description: 'A list of characters',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      data: {
                        type: 'array',
                        items: {
                          $ref: '#/components/schemas/Character'
                        }
                      },
                      pagination: {
                        type: 'object',
                        properties: {
                          page: {
                            type: 'integer'
                          },
                          limit: {
                            type: 'integer'
                          },
                          total: {
                            type: 'integer'
                          },
                          pages: {
                            type: 'integer'
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            '500': {
              $ref: '#/components/responses/UnauthorizedError'
            }
          }
        },
        post: {
          tags: ['Characters'],
          summary: 'Create a new character',
          description: 'Creates a new character and returns the created resource',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Character'
                }
              }
            }
          },
          responses: {
            '201': {
              description: 'Character created successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Character'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/ValidationError'
            },
            '401': {
              $ref: '#/components/responses/UnauthorizedError'
            }
          }
        }
      },
      '/api/characters/{id}': {
        get: {
          tags: ['Characters'],
          summary: 'Get character by ID',
          description: 'Returns a single character by ID',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'Character ID',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Character found',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Character'
                  }
                }
              }
            },
            '404': {
              $ref: '#/components/responses/NotFoundError'
            }
          }
        },
        put: {
          tags: ['Characters'],
          summary: 'Update character',
          description: 'Updates an existing character',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'Character ID',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Character'
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Character updated successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Character'
                  }
                }
              }
            },
            '400': {
              $ref: '#/components/responses/ValidationError'
            },
            '404': {
              $ref: '#/components/responses/NotFoundError'
            }
          }
        },
        delete: {
          tags: ['Characters'],
          summary: 'Delete character',
          description: 'Deletes a character',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'Character ID',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '204': {
              description: 'Character deleted successfully'
            },
            '404': {
              $ref: '#/components/responses/NotFoundError'
            }
          }
        }
      },
      '/api/characters/search': {
        get: {
          tags: ['Characters'],
          summary: 'Search characters',
          description: 'Search characters by name',
          parameters: [
            {
              name: 'query',
              in: 'query',
              description: 'Search query',
              required: true,
              schema: {
                type: 'string'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Search results',
              content: {
                'application/json': {
                  schema: {
                    type: 'array',
                    items: {
                      $ref: '#/components/schemas/Character'
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/characters/sync/{id}': {
        post: {
          tags: ['Characters'],
          summary: 'Sync character',
          description: 'Syncs a character with the Rick and Morty API',
          parameters: [
            {
              name: 'id',
              in: 'path',
              description: 'Rick and Morty character ID',
              required: true,
              schema: {
                type: 'integer'
              }
            }
          ],
          responses: {
            '200': {
              description: 'Character synced successfully',
              content: {
                'application/json': {
                  schema: {
                    $ref: '#/components/schemas/Character'
                  }
                }
              }
            },
            '404': {
              $ref: '#/components/responses/NotFoundError'
            }
          }
        }
      },
      '/health': {
        get: {
          tags: ['Health'],
          summary: 'Health check',
          description: 'Returns the health status of the API',
          responses: {
            '200': {
              description: 'API is healthy',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      status: {
                        type: 'string',
                        example: 'UP'
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./src/infrastructure/entry-points/api/**/*.ts']
};

const swaggerSpec = swaggerJsdoc(options);

export const swaggerDocs = (app: any, port: number) => {
  // Swagger page
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Rick and Morty API Documentation'
  }));

  // Docs in JSON format
  app.get('/api-docs.json', (req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
};

export default swaggerSpec; 