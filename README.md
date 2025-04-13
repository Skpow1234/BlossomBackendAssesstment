# Rick and Morty Character API

A full-featured API for searching and managing Rick and Morty characters, implemented with Express, GraphQL, Sequelize, Redis, and TypeScript.

## Features

- **REST API** for character management
- **GraphQL API** for flexible queries
- **Database storage** with MySQL via Sequelize ORM
- **Redis caching** for improved performance
- **Swagger documentation** for easy API discovery
- **Unit tests** for critical functionality
- **Performance tracking** via decorators
- **Proper error handling** with custom error types
- **Clean architecture** with separation of concerns

## Requirements

- Node.js 14+
- MySQL 5.7+
- Redis 6+
- Docker and Docker Compose (recommended)

## Installation and Setup

### Important: Services Setup First

Before running the application, you **MUST** start the required services (MySQL and Redis). The application depends on these services and will fail to start without them.

> **Note**: The default docker-compose.yml file now maps MySQL to port 3307 and Redis to port 6380 on the host to avoid conflicts with locally running services. The containers internally still use the standard ports.

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/rick-and-morty-api.git
   cd rick-and-morty-api
   ```

2. Create a `.env` file based on the `.env.example`:

   ```bash
   cp .env.example .env
   ```

3. **Start the required services using Docker Compose**:

   ```bash
   docker-compose up -d
   ```

   This starts MySQL and Redis containers configured for this application.

4. Install dependencies (if not using Docker for the app):

   ```bash
   npm install
   ```

5. Build the application:

   ```bash
   npm run build
   ```

6. Run migrations and seed the database:

   ```bash
   npm run migrate
   npm run seed
   ```

7. Start the application:

   ```bash
   npm start
   ```

8. The API will be available at:
   - REST API: <http://localhost:3000/api/characters>
   - GraphQL: <http://localhost:3000/graphql>
   - Swagger docs: <http://localhost:3000/api-docs>

### Full Docker Deployment

If you want to run the entire stack in Docker:

1. Configure the environment variables in the `.env` file.

2. Start all services:

   ```bash
   docker-compose up -d
   ```

3. Check if the app service is running:

   ```bash
   docker-compose ps
   ```

   If you see that the `app` service is not running, start it:

   ```bash
   docker-compose up -d app
   ```

4. Run migrations and seed the database. You have two options:

   **Option A: Fix the .sequelizerc file and use npm scripts**

   ```bash
   # Fix the .sequelizerc file format for CommonJS compatibility
   echo "const path = require('path'); module.exports = { 'config': path.resolve(__dirname, 'src/config', 'database.ts'), 'models-path': path.resolve(__dirname, 'src', 'models'), 'seeders-path': path.resolve(__dirname, 'src', 'seeders'), 'migrations-path': path.resolve(__dirname, 'src', 'migrations') };" > .sequelizerc
   
   # Then run migrations and seeds
   docker-compose exec app npm run migrate
   docker-compose exec app npm run seed
   ```

   **Option B: Use sequelize-cli directly with paths (recommended)**

   ```bash
   # Run migrations directly specifying the paths
   docker-compose exec app npx sequelize-cli db:migrate --config src/config/database.ts --migrations-path src/migrations
   
   # Run seeds directly specifying the paths
   docker-compose exec app npx sequelize-cli db:seed:all --config src/config/database.ts --seeders-path src/seeders
   ```

5. Access the application at the URLs mentioned above.

## Troubleshooting

### Common Issues

- **"Service app is not running" error**: If you get this error when trying to run commands, make sure the app service is started:

  ```bash
  docker-compose up -d app
  ```

- **"Port is already allocated" error**: If you see this error when starting Docker containers, it means the port is already in use on your machine:

  ```
  failed to set up container networking: driver failed programming external connectivity: Bind for 0.0.0.0:3306 failed: port is already allocated
  ```

  Solutions:
  1. Stop any local MySQL service that might be using the port:
     ```bash
     # On Windows
     net stop mysql

     # On Linux/Mac
     sudo service mysql stop
     ```
  
  2. Or use the updated docker-compose.yml which already maps to alternative ports:
     ```
     MySQL: 3307 (host) → 3306 (container)
     Redis: 6380 (host) → 6379 (container)
     ```
  
  3. If modifying ports manually, remember to update your .env file:
     ```
     DB_PORT=3307  # Only needed if connecting from the host
     ```

- **Verifying services are running correctly**: You can check if the services are accessible on the mapped ports:

  ```bash
  # Check if MySQL is accessible (enter the password when prompted)
  mysql -h 127.0.0.1 -P 3307 -u root -p
  
  # Check if Redis is accessible
  redis-cli -h 127.0.0.1 -p 6380 ping
  ```

- **Error connecting to MySQL**: Ensure the MySQL container is running (`docker ps`) and that your `.env` file has the correct connection details.

- **Error connecting to Redis**: Make sure the Redis container is running (`docker ps`).

- **Migration errors**: If you encounter migration errors, try resetting the database with:

  ```bash
  npm run migrate:reset
  npm run migrate
  npm run seed
  ```

- **Running migrations in Docker**: If you're running the application fully in Docker, you can run migrations with:

  ```bash
  docker-compose exec app npm run migrate
  docker-compose exec app npm run seed
  ```

- **Migration errors with .sequelizerc**: If you encounter a "SyntaxError: Cannot use import statement outside a module" error when running migrations, try one of these approaches:

  1. Update .sequelizerc to use CommonJS syntax:

  ```bash
  # First, create a proper .sequelizerc file
  echo "const path = require('path'); module.exports = { 'config': path.resolve(__dirname, 'src/config', 'database.ts'), 'models-path': path.resolve(__dirname, 'src', 'models'), 'seeders-path': path.resolve(__dirname, 'src', 'seeders'), 'migrations-path': path.resolve(__dirname, 'src', 'migrations') };" > .sequelizerc
  
  # Then run migrations again
  docker-compose exec app npm run migrate
  docker-compose exec app npm run seed
  ```

  1. Or skip .sequelizerc and use sequelize-cli directly with paths:

  ```bash
  # Run migrations directly specifying the paths
  docker-compose exec app npx sequelize-cli db:migrate --config src/config/database.ts --migrations-path src/migrations
  
  # Run seeds directly specifying the paths
  docker-compose exec app npx sequelize-cli db:seed:all --config src/config/database.ts --seeders-path src/seeders
  ```

- **Port conflicts**: If ports 3000, 3306, or 6379 are already in use, modify the corresponding values in your `.env` file and `docker-compose.yml`.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| NODE_ENV | Environment (development/production) | development |
| PORT | Server port | 3000 |
| DB_HOST | MySQL hostname | localhost (or `db` inside Docker) |
| DB_PORT | MySQL port | 3306 (mapped to 3307 on host) |
| DB_NAME | MySQL database name | rickandmorty |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | password |
| REDIS_HOST | Redis hostname | localhost (or `redis` inside Docker) |
| REDIS_PORT | Redis port | 6379 (mapped to 6380 on host) |
| REDIS_PASSWORD | Redis password (optional) | null |
| API_KEY | API key for secure endpoints | my-secret-api-key |
| CHARACTER_SYNC_CRON | Cron schedule for character sync | 0 */12* ** |

## API Endpoints

### REST API

#### Characters

- `GET /api/characters` - Get all characters
- `GET /api/characters/:id` - Get character by ID
- `POST /api/characters` - Create a new character
- `PUT /api/characters/:id` - Update a character
- `DELETE /api/characters/:id` - Delete a character
- `GET /api/characters/search?query=rick` - Search characters
- `POST /api/characters/sync/:id` - Sync character with Rick and Morty API

### GraphQL API

The GraphQL endpoint is available at `/graphql`. You can use the GraphQL Playground in development mode to explore the schema and execute queries.

#### Example Queries

```graphql
# Get all characters
query {
  characters {
    id
    name
    status
    species
    gender
  }
}

# Search characters
query {
  searchCharacters(query: "rick") {
    id
    name
    status
  }
}

# Get character by ID
query {
  character(id: "1") {
    id
    name
    status
    species
    gender
    origin
    location
    image
    episode
  }
}
```

#### Example Mutations

```graphql
# Sync character with Rick and Morty API
mutation {
  syncCharacter(id: 1) {
    id
    name
    status
  }
}

# Create a new character
mutation {
  createCharacter(
    name: "Test Character"
    status: "Alive"
    species: "Human"
    gender: "Male"
    origin: "Earth"
    location: "Earth"
    image: "https://example.com/image.jpg"
    episode: ["https://example.com/episode/1"]
    url: "https://example.com/character/1"
  ) {
    id
    name
  }
}
```

## Testing

Run the unit tests:

```bash
npm test
```

## Documentation

The API is documented using Swagger. Access the documentation at:

```bash
http://localhost:3000/api-docs
```

## Cron Jobs

The application includes a scheduled job that runs every 12 hours to sync characters with the Rick and Morty API.

### Testing the Cron Job

To test the cron job functionality within Docker containers:

1. **Start all required services**:
   ```bash
   # Start the full application stack
   docker-compose up -d
   ```

2. **Check that all services are running**:
   ```bash
   docker-compose ps
   ```
   
   Ensure that the app, db (MySQL), and redis services are all showing as "Up".

3. **Run the test script directly in the Docker container**:
   ```bash
   # Execute the test script inside the app container
   docker-compose exec app node dist/testRedis.js
   ```

4. **View cron job logs**:
   ```bash
   # Check logs for cron job activity
   docker-compose logs app | grep "CharacterSyncJob"
   ```

5. **Trigger a manual synchronization** using the GraphQL API:
   ```bash
   # Open the GraphQL playground in your browser at http://localhost:3000/graphql
   # Then run this mutation:
   mutation {
     syncAllCharacters
   }
   ```

6. **Modify the cron schedule for more frequent testing**:
   
   Add this environment variable to your .env file to run the job every minute:
   ```
   CHARACTER_SYNC_CRON="* * * * *"
   ```
   
   Then restart the application:
   ```bash
   docker-compose restart app
   ```

> **Note**: For proper testing, all services must be running in Docker to ensure proper networking between containers.

## Architecture

The project follows a clean architecture approach with the following layers:

- **Domain Layer**: Contains entities, interfaces, and business logic
- **Application Layer**: Contains services, controllers, and application logic
- **Infrastructure Layer**: Contains implementations of interfaces, external services, databases, etc.

## Database Schema

![Database ERD](./docs/database_erd.md)

## License

MIT
