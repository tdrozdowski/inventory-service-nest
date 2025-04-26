# Unit Testing in NestJS

This document provides guidance on how to write unit tests for different components of a NestJS module in this project.

## Table of Contents

1. [Introduction](#introduction)
2. [Testing Setup](#testing-setup)
3. [Testing Services](#testing-services)
4. [Testing Controllers](#testing-controllers)
5. [Testing Repositories](#testing-repositories)
6. [Running Tests](#running-tests)
7. [Best Practices](#best-practices)

## Introduction

Unit testing is an essential part of software development that helps ensure your code works as expected. In this project, we use Jest as our testing framework to write and run unit tests.

Each module in the application typically consists of:

- A controller that handles HTTP requests
- A service that contains business logic
- A repository that interacts with the database

Each of these components should be tested in isolation to ensure they work correctly.

## Testing Setup

### Jest Configuration

The Jest configuration is defined in the `package.json` file. It specifies:

- The test file pattern (`*.spec.ts`)
- The coverage thresholds
- The test environment
- The coverage reporters

### Test Files

Test files should be placed alongside the files they are testing with the `.spec.ts` extension. For example:

- `items.controller.ts` → `items.controller.spec.ts`
- `items.service.ts` → `items.service.spec.ts`
- `items.repository.ts` → `items.repository.spec.ts`

## Testing Services

Services contain the business logic of your application. When testing services, you should mock their dependencies (usually repositories) to isolate the service logic.

### Example: Testing a Service

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemsRepository } from './items.repository';

// Mock the repository
jest.mock('./items.repository', () => {
  return {
    ItemsRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn(),
      findOne: jest.fn(),
      // ... other methods
    })),
  };
});

describe('ItemsService', () => {
  let service: ItemsService;
  let repository: ItemsRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService, ItemsRepository],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    repository = module.get<ItemsRepository>(ItemsRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [
        /* mock data */
      ];
      (repository.findAll as jest.Mock).mockResolvedValue(mockItems);

      const result = await service.findAll();

      expect(result).toEqual(mockItems);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    // ... other test cases
  });

  // ... tests for other methods
});
```

## Testing Controllers

Controllers handle HTTP requests and delegate to services. When testing controllers, you should mock the services they depend on.

### Example: Testing a Controller

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { NotFoundException } from '@nestjs/common';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            // ... other methods
          },
        },
      ],
    }).compile();

    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [
        /* mock data */
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(mockItems);

      const result = await controller.findAll();

      expect(result).toEqual(mockItems);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    // ... other test cases
  });

  // ... tests for other methods
});
```

## Testing Repositories

Repositories interact with the database. When testing repositories, you should mock the database connection.

### Example: Testing a Repository

```typescript
import { ItemsRepository } from './items.repository';

// Mock the InjectConnection decorator
jest.mock('nest-knexjs', () => ({
  InjectConnection: () => () => {},
}));

describe('ItemsRepository', () => {
  let repository: ItemsRepository;
  let mockKnex: any;
  let mockTable: any;

  beforeEach(() => {
    // Create mock for Knex query builder chain
    mockTable = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      // ... other methods
    };

    // Create mock for Knex instance
    mockKnex = {
      table: jest.fn().mockReturnValue(mockTable),
    };

    // Directly instantiate the repository with the mock Knex instance
    repository = new ItemsRepository(mockKnex);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const mockItems = [
        /* mock data */
      ];
      mockTable.select.mockImplementation(() => mockItems);

      const result = await repository.findAll();

      expect(result).toEqual(mockItems);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.select).toHaveBeenCalledWith('*');
    });

    // ... other test cases
  });

  // ... tests for other methods
});
```

## Running Tests

You can run the tests using the following npm scripts:

- `npm test`: Run all unit tests
- `npm run test:watch`: Run tests in watch mode (useful during development)
- `npm run test:cov`: Run tests with coverage reporting
- `npm run test:debug`: Run tests in debug mode

## Best Practices

1. **Isolate the unit under test**: Mock all dependencies to ensure you're only testing the unit in question.
2. **Test both success and error cases**: Ensure your code handles errors gracefully.
3. **Use descriptive test names**: Make it clear what each test is checking.
4. **Keep tests simple and focused**: Each test should verify a single behavior.
5. **Maintain high test coverage**: Aim for at least 75% coverage (as specified in the Jest configuration).
6. **Reset mocks between tests**: Use `jest.clearAllMocks()` in the `beforeEach` block to ensure tests don't affect each other.
7. **Use the NestJS testing utilities**: The `@nestjs/testing` package provides utilities for testing NestJS components.
8. **Test edge cases**: Ensure your code handles unusual inputs correctly.
