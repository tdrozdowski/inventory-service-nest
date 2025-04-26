import { PersonsRepository } from './persons.repository';
import { Person } from './persons.interface';

// Mock the InjectConnection decorator
jest.mock('nest-knexjs', () => ({
  InjectConnection: () => () => {},
}));

describe('PersonsRepository', () => {
  let repository: PersonsRepository;
  let mockKnex: any;
  let mockTable: any;

  // Mock data
  const mockPerson: Person = {
    id: '1',
    alt_id: 'person-001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    created_by: 'system',
    created_at: new Date(),
    last_update: new Date(),
    last_changed_by: 'system',
  };

  beforeEach(() => {
    // Create mock for Knex query builder chain
    mockTable = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
    };

    // Create mock for Knex instance
    mockKnex = {
      table: jest.fn().mockReturnValue(mockTable),
    };

    // Directly instantiate the repository with the mock Knex instance
    repository = new PersonsRepository(mockKnex);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      const mockPersons = [mockPerson];
      mockTable.select.mockImplementation(() => mockPersons);

      const result = await repository.findAll();

      expect(result).toEqual(mockPersons);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.select).toHaveBeenCalledWith('*');
    });
  });

  describe('findOne', () => {
    it('should return a single person by id', async () => {
      mockTable.first.mockResolvedValue(mockPerson);

      const result = await repository.findOne('1');

      expect(result).toEqual(mockPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '1');
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should return null when person is not found', async () => {
      mockTable.first.mockResolvedValue(null);

      const result = await repository.findOne('999');

      expect(result).toBeNull();
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '999');
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.first.mockRejectedValue(error);

      await expect(repository.findOne('1')).rejects.toThrow('Database error');
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '1');
      expect(mockTable.first).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should return a single person by email', async () => {
      mockTable.first.mockResolvedValue(mockPerson);

      const result = await repository.findByEmail('john.doe@example.com');

      expect(result).toEqual(mockPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith(
        'email',
        'john.doe@example.com',
      );
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should return null when person is not found by email', async () => {
      mockTable.first.mockResolvedValue(null);

      const result = await repository.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith(
        'email',
        'nonexistent@example.com',
      );
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.first.mockRejectedValue(error);

      await expect(
        repository.findByEmail('john.doe@example.com'),
      ).rejects.toThrow('Database error');
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith(
        'email',
        'john.doe@example.com',
      );
      expect(mockTable.first).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new person', async () => {
      const personToCreate = {
        name: 'New Person',
        email: 'new.person@example.com',
      };
      const createdPerson = {
        ...personToCreate,
        id: '3',
        alt_id: 'person-003',
        created_by: 'system',
      };
      mockTable.returning.mockResolvedValue([createdPerson]);

      const result = await repository.create(personToCreate);

      expect(result).toEqual(createdPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.insert).toHaveBeenCalledWith({
        ...personToCreate,
        created_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should use provided created_by value', async () => {
      const personWithCreatedBy = {
        name: 'New Person',
        email: 'new.person@example.com',
        created_by: 'test-user',
      };
      const createdPerson = {
        ...personWithCreatedBy,
        id: '3',
        alt_id: 'person-003',
      };
      mockTable.returning.mockResolvedValue([createdPerson]);

      const result = await repository.create(personWithCreatedBy);

      expect(result).toEqual(createdPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.insert).toHaveBeenCalledWith(personWithCreatedBy);
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should propagate database errors', async () => {
      const personToCreate = {
        name: 'New Person',
        email: 'new.person@example.com',
      };
      const error = new Error('Database error');
      mockTable.returning.mockRejectedValue(error);

      await expect(repository.create(personToCreate)).rejects.toThrow(
        'Database error',
      );
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.insert).toHaveBeenCalledWith({
        ...personToCreate,
        created_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });
  });

  describe('update', () => {
    it('should update and return a person', async () => {
      const personToUpdate = { name: 'Updated Name' };
      const updatedPerson = { ...mockPerson, name: 'Updated Name' };
      mockTable.returning.mockResolvedValue([updatedPerson]);

      const result = await repository.update('1', personToUpdate);

      expect(result).toEqual(updatedPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '1');
      expect(mockTable.update).toHaveBeenCalledWith({
        ...personToUpdate,
        last_update: expect.any(Date),
        last_changed_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should use provided last_changed_by value', async () => {
      const personToUpdate = {
        name: 'Updated Name',
        last_changed_by: 'test-user',
      };
      const updatedPerson = { ...mockPerson, ...personToUpdate };
      mockTable.returning.mockResolvedValue([updatedPerson]);

      const result = await repository.update('1', personToUpdate);

      expect(result).toEqual(updatedPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '1');
      expect(mockTable.update).toHaveBeenCalledWith({
        ...personToUpdate,
        last_update: expect.any(Date),
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should return undefined when no person is updated', async () => {
      mockTable.returning.mockResolvedValue([]);

      const result = await repository.update('999', { name: 'Updated Name' });

      expect(result).toBeUndefined();
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '999');
      expect(mockTable.update).toHaveBeenCalledWith({
        name: 'Updated Name',
        last_update: expect.any(Date),
        last_changed_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should propagate database errors', async () => {
      const personToUpdate = { name: 'Updated Name' };
      const error = new Error('Database error');
      mockTable.returning.mockRejectedValue(error);

      await expect(repository.update('1', personToUpdate)).rejects.toThrow(
        'Database error',
      );
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '1');
      expect(mockTable.update).toHaveBeenCalledWith({
        ...personToUpdate,
        last_update: expect.any(Date),
        last_changed_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });
  });

  describe('remove', () => {
    it('should remove a person', async () => {
      mockTable.delete.mockResolvedValue(1);

      await repository.remove('1');

      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '1');
      expect(mockTable.delete).toHaveBeenCalled();
    });

    it('should handle case when no person is removed', async () => {
      mockTable.delete.mockResolvedValue(0);

      await repository.remove('999');

      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '999');
      expect(mockTable.delete).toHaveBeenCalled();
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.delete.mockRejectedValue(error);

      await expect(repository.remove('1')).rejects.toThrow('Database error');
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', '1');
      expect(mockTable.delete).toHaveBeenCalled();
    });
  });
});
