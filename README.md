# Rick and Morty Character API

A RESTful API built with Node.js, Express, and TypeScript that allows searching and managing Rick and Morty characters. The API integrates with the Rick and Morty API and includes features like caching, logging, and automatic character synchronization.

## Features

- Search characters with multiple filters (name, status, species, gender, origin)
- Redis caching for improved performance
- Automatic character synchronization every 12 hours
- Comprehensive logging and error handling
- Swagger documentation
- Docker support for easy deployment
- Unit tests with Jest

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MySQL (v8.0 or higher)
- Redis (v6.2 or higher)
- Docker and Docker Compose (optional)

## Project Structure

```txt
src/
├── domain/              # Domain layer
│   ├── entities/        # Domain entities
│   ├── repositories/    # Repository interfaces
│   └── services/        # Business logic
├── infrastructure/      # Infrastructure layer
│   ├── cache/          # Cache implementation
│   ├── database/       # Database configuration
│   ├── entry-points/   # API endpoints
│   ├── external/       # External API clients
│   └── repositories/   # Repository implementations
└── __tests__/          # Test files
```

## Setup

### Option 1: Using Docker (Recommended)

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd blossom-backend-test
   ```

2. Build and start the services:

   ```bash
   docker-compose up --build
   ```

   This will start:
   - Node.js application on port 3000
   - MySQL database on port 3306
   - Redis cache on port 6379

3. Run database migrations:

   ```bash
   docker-compose exec app npm run migrate
   ```

4. Run database seeds (optional):

   ```bash
   docker-compose exec app npm run seed
   ```

5. Access the API:
   - API: <http://localhost:3000>
   - Swagger documentation: <http://localhost:3000/api-docs>

### Option 2: Local Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd blossom-backend-test
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory with the following content:

   ```txt
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASSWORD=root
   DB_NAME=blossom
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

4. Start MySQL and Redis:
   - Start MySQL server
   - Start Redis server

5. Run database migrations:

   ```bash
   npm run migrate
   ```

6. Run database seeds (optional):

   ```bash
   npm run seed
   ```

7. Start the development server:

   ```bash
   npm run dev
   ```

8. Access the API:
   - API: <http://localhost:3000>
   - Swagger documentation: <http://localhost:3000/api-docs>

## Docker Services Configuration

The project uses Docker Compose to manage three services:

1. **App Service** (`app`):
   - Builds from the local Dockerfile
   - Exposes port 3000
   - Mounts the local directory for development
   - Connects to MySQL and Redis services
   - Environment variables for database and Redis configuration

2. **Database Service** (`db`):
   - Uses MySQL 8.0 image
   - Exposes port 3306
   - Persistent volume for data storage
   - Root password and database name configuration

3. **Redis Service** (`redis`):
   - Uses Redis 6.2-alpine image
   - Exposes port 6379
   - Persistent volume for data storage

All services are connected through a custom network (`blossom-network`).

## Available Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the TypeScript code
- `npm run start`: Start the production server
- `npm run test`: Run tests
- `npm run test:watch`: Run tests in watch mode
- `npm run migrate`: Run database migrations
- `npm run seed`: Run database seeds
- `npm run lint`: Run ESLint
- `npm run format`: Format code with Prettier

## API Documentation

The API documentation is available at `/api-docs` when the server is running. It includes:

- Character search endpoints
- Authentication endpoints
- Request/response schemas
- Error responses
- Security requirements

## Testing

Run the test suite:

```bash
npm run test
```

The tests cover:

- Character search functionality
- Character synchronization
- Error handling
- Edge cases

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
