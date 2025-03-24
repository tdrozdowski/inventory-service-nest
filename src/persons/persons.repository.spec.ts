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
    id: 1,
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

      const result = await repository.findOne(1);

      expect(result).toEqual(mockPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
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
  });

  describe('create', () => {
    it('should create and return a new person', async () => {
      const personToCreate = {
        name: 'New Person',
        email: 'new.person@example.com',
      };
      const createdPerson = {
        ...personToCreate,
        id: 3,
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
  });

  describe('update', () => {
    it('should update and return a person', async () => {
      const personToUpdate = { name: 'Updated Name' };
      const updatedPerson = { ...mockPerson, name: 'Updated Name' };
      mockTable.returning.mockResolvedValue([updatedPerson]);

      const result = await repository.update(1, personToUpdate);

      expect(result).toEqual(updatedPerson);
      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
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

      await repository.remove(1);

      expect(mockKnex.table).toHaveBeenCalledWith('persons');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.delete).toHaveBeenCalled();
    });
  });
});
