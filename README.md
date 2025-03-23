<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
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

This project uses GitHub Actions for continuous integration and testing. There are two main workflows:

1. **Unit Tests Workflow** (`.github/workflows/unit-tests.yml`): Runs linting, unit tests, and test coverage.
2. **E2E Tests Workflow** (`.github/workflows/e2e-tests.yml`): Runs end-to-end tests with a PostgreSQL database.

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

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
