import { Test, TestingModule } from '@nestjs/testing';
import { PersonsService } from './persons.service';
import { Person } from './persons.interface';

// Mock the entire repository module to avoid import errors
jest.mock('./persons.repository', () => {
  return {
    PersonsRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByAltId: jest.fn(),
      findByEmail: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    })),
  };
});

// Import after mocking
import { PersonsRepository } from './persons.repository';

describe('PersonsService', () => {
  let service: PersonsService;
  let repository: PersonsRepository;

  // Mock data
  const mockPersons: Person[] = [
    {
      id: 1,
      alt_id: 'person-001',
      name: 'Test Person 1',
      email: 'test1@example.com',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
    {
      id: 2,
      alt_id: 'person-002',
      name: 'Test Person 2',
      email: 'test2@example.com',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
  ];

  const mockPerson = mockPersons[0];
  const mockPersonToCreate: Omit<Person, 'id' | 'alt_id'> = {
    name: 'New Person',
    email: 'new@example.com',
  };

  // The repository is already mocked at the module level

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PersonsService, PersonsRepository],
    }).compile();

    service = module.get<PersonsService>(PersonsService);
    repository = module.get<PersonsRepository>(PersonsRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup the repository mock methods for each test
    const repositoryInstance = repository as unknown as {
      findAll: jest.Mock;
      findOne: jest.Mock;
      findByAltId: jest.Mock;
      findByEmail: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      remove: jest.Mock;
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      (repository.findAll as jest.Mock).mockResolvedValue(mockPersons);

      const result = await service.findAll();

      expect(result).toEqual(mockPersons);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no persons exist', async () => {
      (repository.findAll as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle database errors', async () => {
      const error = new Error('Database connection error');
      (repository.findAll as jest.Mock).mockRejectedValue(error);

      await expect(service.findAll()).rejects.toThrow(
        'Database connection error',
      );
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single person by id', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockPerson);

      const result = await service.findOne(1);

      expect(result).toEqual(mockPerson);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when person is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne(999);

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith(999);
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      (repository.findOne as jest.Mock).mockRejectedValue(error);

      await expect(service.findOne(1)).rejects.toThrow('Database error');
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByAltId', () => {
    it('should return a single person by alt_id', async () => {
      (repository.findByAltId as jest.Mock).mockResolvedValue(mockPerson);

      const result = await service.findByAltId('person-001');

      expect(result).toEqual(mockPerson);
      expect(repository.findByAltId).toHaveBeenCalledWith('person-001');
    });

    it('should return null when person is not found by alt_id', async () => {
      (repository.findByAltId as jest.Mock).mockResolvedValue(null);

      const result = await service.findByAltId('non-existent');

      expect(result).toBeNull();
      expect(repository.findByAltId).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('findByEmail', () => {
    it('should return a single person by email', async () => {
      (repository.findByEmail as jest.Mock).mockResolvedValue(mockPerson);

      const result = await service.findByEmail('test1@example.com');

      expect(result).toEqual(mockPerson);
      expect(repository.findByEmail).toHaveBeenCalledWith('test1@example.com');
    });

    it('should return null when person is not found by email', async () => {
      (repository.findByEmail as jest.Mock).mockResolvedValue(null);

      const result = await service.findByEmail('non-existent@example.com');

      expect(result).toBeNull();
      expect(repository.findByEmail).toHaveBeenCalledWith(
        'non-existent@example.com',
      );
    });
  });

  describe('create', () => {
    it('should create and return a new person', async () => {
      const createdPerson = {
        ...mockPersonToCreate,
        id: 3,
        alt_id: 'person-003',
      };
      (repository.create as jest.Mock).mockResolvedValue(createdPerson);

      const result = await service.create(mockPersonToCreate);

      expect(result).toEqual(createdPerson);
      expect(repository.create).toHaveBeenCalledWith(mockPersonToCreate);
    });

    it('should handle validation errors during creation', async () => {
      const error = new Error('Validation error');
      (repository.create as jest.Mock).mockRejectedValue(error);

      await expect(service.create(mockPersonToCreate)).rejects.toThrow(
        'Validation error',
      );
      expect(repository.create).toHaveBeenCalledWith(mockPersonToCreate);
    });
  });

  describe('update', () => {
    it('should update and return a person', async () => {
      const personToUpdate = { name: 'Updated Person' };
      const updatedPerson = { ...mockPerson, name: 'Updated Person' };
      (repository.update as jest.Mock).mockResolvedValue(updatedPerson);

      const result = await service.update(1, personToUpdate);

      expect(result).toEqual(updatedPerson);
      expect(repository.update).toHaveBeenCalledWith(1, personToUpdate);
    });

    it('should return null when trying to update a non-existent person', async () => {
      const personToUpdate = { name: 'Updated Person' };
      (repository.update as jest.Mock).mockResolvedValue(null);

      const result = await service.update(999, personToUpdate);

      expect(result).toBeNull();
      expect(repository.update).toHaveBeenCalledWith(999, personToUpdate);
    });

    it('should handle errors during update', async () => {
      const personToUpdate = { name: 'Updated Person' };
      const error = new Error('Update error');
      (repository.update as jest.Mock).mockRejectedValue(error);

      await expect(service.update(1, personToUpdate)).rejects.toThrow(
        'Update error',
      );
      expect(repository.update).toHaveBeenCalledWith(1, personToUpdate);
    });
  });

  describe('remove', () => {
    it('should remove a person', async () => {
      (repository.remove as jest.Mock).mockResolvedValue(undefined);

      await service.remove(1);

      expect(repository.remove).toHaveBeenCalledWith(1);
    });

    it('should handle errors during removal', async () => {
      const error = new Error('Removal error');
      (repository.remove as jest.Mock).mockRejectedValue(error);

      await expect(service.remove(1)).rejects.toThrow('Removal error');
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});
