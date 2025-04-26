# Inventory Service NestJS

![Node.js Version](https://img.shields.io/badge/node-%3E%3D22.0.0-brightgreen)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/username/inventory-service-nest/unit-tests.yml?label=tests)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/username/inventory-service-nest/e2e-tests.yml?label=e2e)
![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/username/inventory-service-nest/docker-publish.yml?label=docker)

A RESTful API service for inventory management built with NestJS, Knex.js, and PostgreSQL.

## Project setup

```bash
$ npm install
```

## API Documentation

This project includes OpenAPI documentation that can be accessed through the following endpoints:

- `/docs` - Swagger UI documentation
- `/docs-redoc` - ReDoc UI documentation (more user-friendly)

The OpenAPI specification is also available as a JSON file at `/docs-json` and is saved to the project root as `openapi-spec.json`.

To generate or update the OpenAPI specification:

```bash
# Generate OpenAPI spec (after building the project)
$ npm run generate-openapi

# The build process automatically generates the OpenAPI spec
$ npm run build
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

For detailed information on how to write unit tests for different components of a NestJS module in this project, see the [UNIT_TESTING.md](UNIT_TESTING.md) document.

## Integration Tests

This project includes comprehensive integration tests that use HTTP client (supertest) to test the API endpoints. These tests verify that the entire request-response cycle works correctly, including controllers, services, and database operations.

### Integration Test Structure

The integration tests are organized by module:

- `test/items.e2e-spec.ts`: Tests for the Items API endpoints
- `test/persons.e2e-spec.ts`: Tests for the Persons API endpoints
- `test/invoices.e2e-spec.ts`: Tests for the Invoices API endpoints
- `test/invoices-items.e2e-spec.ts`: Tests for the InvoicesItems API endpoints

Each test file follows a similar pattern:

1. Set up a test NestJS application
2. Create test data
3. Test all CRUD operations for the module
4. Clean up test data

### Test Utilities

The `test/test-utils.ts` file provides helper functions for common test operations:

- Creating and initializing a test application
- Creating test data (items, persons, invoices, invoice-items)
- Cleaning up test data

### Running Integration Tests

To run the integration tests:

```bash
# Run all integration tests
$ npm run test:e2e

# Run a specific test file
$ npx jest --config ./test/jest-e2e.json test/items.e2e-spec.ts
```

Note: Integration tests require a running database. Make sure your database is properly configured and running before executing the tests. You can use the Docker Compose setup to start a test database.

## JetBrains HTTP Client Tests

This project includes HTTP Client test files for testing the API endpoints using JetBrains HTTP Client. These files can be used with JetBrains IDEs (IntelliJ IDEA, WebStorm, etc.) that support the HTTP Client plugin.

### HTTP Client Test Files

- `http/api-tests.http`: Basic tests for all API endpoints
- `http/advanced-api-tests.http`: Advanced tests with chained requests and complete workflow scenarios

### Features

- Environment variables for different environments (development, production)
- Chained requests that use the response from previous requests
- Complete workflow scenarios that demonstrate real-world use cases
- Tests for all API endpoints organized by module

For more details on how to use the HTTP Client tests, see the [HTTP_CLIENT_TESTS.md](http/HTTP_CLIENT_TESTS.md) file.

## Database Integration with Knex

This project uses [Knex.js](http://knexjs.org/) as a SQL query builder for database operations. The integration is set up with PostgreSQL, but you can easily switch to another database by changing the configuration and driver.

### Database Configuration

The database configuration is located in `src/config/database.config.ts`. You can customize the connection details by setting the following environment variables:

- `DATABASE_HOST`: Database host (default: 'localhost')
- `DATABASE_PORT`: Database port (default: '5432')
- `DATABASE_USER`: Database user (default: 'postgres')
- `DATABASE_PASSWORD`: Database password (default: 'postgres')
- `DATABASE_NAME`: Database name (default: 'inventory')

### Migrations

Migrations are used to manage database schema changes. The project includes the following commands for working with migrations:

```bash
# Create a new migration file
$ npm run migrate:make [migration_name]

# Run all pending migrations
$ npm run migrate:latest

# Rollback the last batch of migrations
$ npm run migrate:rollback
```

Migration files are stored in the `migrations` directory.

### Seeds

Seeds are used to populate the database with initial data. The project includes the following commands for working with seeds:

```bash
# Create a new seed file
$ npm run seed:make [seed_name]

# Run all seed files
$ npm run seed:run
```

Seed files are stored in the `seeds` directory.

### Using Knex in Services

You can inject the Knex instance into your services using dependency injection:

```typescript
import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nest-knexjs';

@Injectable()
export class ItemsService {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findAll() {
    return this.knex.table('items').select('*');
  }

  async findOne(id: number) {
    return this.knex.table('items').where('id', id).first();
  }

  async create(data: any) {
    return this.knex.table('items').insert(data).returning('*');
  }

  async update(id: number, data: any) {
    return this.knex.table('items').where('id', id).update(data).returning('*');
  }

  async remove(id: number) {
    return this.knex.table('items').where('id', id).delete();
  }
}
```

## Docker Deployment

This project includes Docker support for easy deployment. You can use Docker to build and run the application in a containerized environment.

### Building and Running with Docker

To build and run the application using Docker:

```bash
# Build the Docker image
$ docker build -t inventory-service-nest .

# Run the container
$ docker run -p 3000:3000 \
  -e DATABASE_HOST=your-db-host \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=your-password \
  -e DATABASE_NAME=inventory \
  inventory-service-nest
```

### Using Docker Compose

For a complete development environment with both the application and database, you can use Docker Compose:

```bash
# Start the application and database
$ docker-compose up

# Start in detached mode
$ docker-compose up -d

# Stop the containers
$ docker-compose down

# Stop the containers and remove volumes
$ docker-compose down -v
```

The docker-compose.yml file defines:

- A PostgreSQL database service
- The NestJS application service
- Environment variables for both services
- Volume for database persistence

When using Docker Compose, the application will automatically:

1. Run database migrations
2. Seed the database with initial data
3. Start the application in production mode

## GitHub Actions

This project uses GitHub Actions for continuous integration, testing, and deployment. There are three main workflows:

1. **Unit Tests Workflow** (`.github/workflows/unit-tests.yml`): Runs linting, unit tests, and test coverage.
2. **E2E Tests Workflow** (`.github/workflows/e2e-tests.yml`): Runs end-to-end tests with a PostgreSQL database.
3. **Docker Publish Workflow** (`.github/workflows/docker-publish.yml`): Builds and publishes Docker images to GitHub Container Registry (GHCR) using semantic versioning.

### Docker Image Publishing

The Docker Publish workflow automatically builds and publishes Docker images to GitHub Container Registry (GHCR) when:

- A new release is published
- A new tag with format `v*.*.*` is pushed
- Code is pushed to the main/master branch

#### Semantic Versioning

The workflow uses semantic versioning (SEMVER) for Docker image tags:

- When a release or tag with format `v1.2.3` is created:

  - `ghcr.io/username/inventory-service-nest:1.2.3` (full version)
  - `ghcr.io/username/inventory-service-nest:1.2` (major.minor)
  - `ghcr.io/username/inventory-service-nest:1` (major)

- When code is pushed to main/master:
  - `ghcr.io/username/inventory-service-nest:main` (branch name)
  - `ghcr.io/username/inventory-service-nest:sha-abc123` (commit SHA)

#### Using the Published Docker Images

To pull and run the published Docker image:

```bash
# Pull the latest version
$ docker pull ghcr.io/username/inventory-service-nest:latest

# Pull a specific version
$ docker pull ghcr.io/username/inventory-service-nest:1.2.3

# Run the container
$ docker run -p 3000:3000 \
  -e DATABASE_HOST=your-db-host \
  -e DATABASE_PORT=5432 \
  -e DATABASE_USER=postgres \
  -e DATABASE_PASSWORD=your-password \
  -e DATABASE_NAME=inventory \
  ghcr.io/username/inventory-service-nest:1.2.3
```

Replace `username` with your GitHub username or organization name.

### Testing GitHub Actions Locally

You can test GitHub Actions locally using [act](https://github.com/nektos/act), a tool that runs GitHub Actions locally using Docker.

#### Installation

First, install `act` following the instructions on the [official GitHub repository](https://github.com/nektos/act#installation).

For macOS:

```bash
brew install act
```

For Linux:

```bash
curl -s https://raw.githubusercontent.com/nektos/act/master/install.sh | sudo bash
```

For Windows:

```bash
choco install act-cli
```

#### Running GitHub Actions Locally

Once `act` is installed, you can use the following npm scripts to test the GitHub Actions workflows locally:

```bash
# Test the unit tests workflow
$ npm run test:github-actions:unit

# Test the e2e tests workflow
$ npm run test:github-actions:e2e

# Test the Docker publish workflow
$ npm run test:github-actions:docker
```

These commands will run the respective GitHub Actions workflows locally using Docker, simulating the same environment as GitHub's runners.

#### Requirements

- Docker must be installed and running on your machine
- Sufficient disk space for Docker images
- Internet connection to download Docker images (first run only)

#### Troubleshooting

If you encounter any issues with `act`:

1. Make sure Docker is running
2. Try running with increased verbosity: `act -v`
3. Check the [act documentation](https://github.com/nektos/act#commands) for more options
