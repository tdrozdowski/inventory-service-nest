import { ItemsRepository } from './items.repository';
import { Item } from './items.interface';

// Mock the InjectConnection decorator
jest.mock('nest-knexjs', () => ({
  InjectConnection: () => () => {},
}));

describe('ItemsRepository', () => {
  let repository: ItemsRepository;
  let mockKnex: any;
  let mockTable: any;

  // Mock data
  const mockItems: Item[] = [
    {
      id: 1,
      alt_id: 'item-001',
      name: 'Test Item 1',
      description: 'This is test item 1',
      unit_price: 10.99,
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
    {
      id: 2,
      alt_id: 'item-002',
      name: 'Test Item 2',
      description: 'This is test item 2',
      unit_price: 20.99,
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
  ];

  const mockItem = mockItems[0];
  const mockItemToCreate: Omit<Item, 'id' | 'alt_id'> = {
    name: 'New Item',
    description: 'This is a new item',
    unit_price: 15.99,
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
    repository = new ItemsRepository(mockKnex);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      mockTable.select.mockImplementation(() => mockItems);

      const result = await repository.findAll();

      expect(result).toEqual(mockItems);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.select).toHaveBeenCalledWith('*');
    });

    it('should handle empty results', async () => {
      mockTable.select.mockImplementation(() => []);

      const result = await repository.findAll();

      expect(result).toEqual([]);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.select).toHaveBeenCalledWith('*');
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.select.mockRejectedValue(error);

      await expect(repository.findAll()).rejects.toThrow('Database error');
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.select).toHaveBeenCalledWith('*');
    });
  });

  describe('findOne', () => {
    it('should return a single item by id', async () => {
      mockTable.first.mockResolvedValue(mockItem);

      const result = await repository.findOne(1);

      expect(result).toEqual(mockItem);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should return null when item is not found', async () => {
      mockTable.first.mockResolvedValue(null);

      const result = await repository.findOne(999);

      expect(result).toBeNull();
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 999);
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.first.mockRejectedValue(error);

      await expect(repository.findOne(1)).rejects.toThrow('Database error');
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.first).toHaveBeenCalled();
    });
  });

  describe('findByAltId', () => {
    it('should return a single item by alt_id', async () => {
      mockTable.first.mockResolvedValue(mockItem);

      const result = await repository.findByAltId('item-001');

      expect(result).toEqual(mockItem);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('alt_id', 'item-001');
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should return null when item is not found by alt_id', async () => {
      mockTable.first.mockResolvedValue(null);

      const result = await repository.findByAltId('non-existent');

      expect(result).toBeNull();
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('alt_id', 'non-existent');
      expect(mockTable.first).toHaveBeenCalled();
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.first.mockRejectedValue(error);

      await expect(repository.findByAltId('item-001')).rejects.toThrow(
        'Database error',
      );
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('alt_id', 'item-001');
      expect(mockTable.first).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new item', async () => {
      const createdItem = {
        ...mockItemToCreate,
        id: 3,
        alt_id: 'item-003',
        created_by: 'system',
      };
      mockTable.returning.mockResolvedValue([createdItem]);

      const result = await repository.create(mockItemToCreate);

      expect(result).toEqual(createdItem);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.insert).toHaveBeenCalledWith({
        ...mockItemToCreate,
        created_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should use provided created_by value', async () => {
      const itemWithCreatedBy = {
        ...mockItemToCreate,
        created_by: 'test-user',
      };
      const createdItem = {
        ...itemWithCreatedBy,
        id: 3,
        alt_id: 'item-003',
      };
      mockTable.returning.mockResolvedValue([createdItem]);

      const result = await repository.create(itemWithCreatedBy);

      expect(result).toEqual(createdItem);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.insert).toHaveBeenCalledWith(itemWithCreatedBy);
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.returning.mockRejectedValue(error);

      await expect(repository.create(mockItemToCreate)).rejects.toThrow(
        'Database error',
      );
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.insert).toHaveBeenCalledWith({
        ...mockItemToCreate,
        created_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });
  });

  describe('update', () => {
    it('should update and return an item', async () => {
      const itemToUpdate = { name: 'Updated Item' };
      const updatedItem = { ...mockItem, name: 'Updated Item' };
      mockTable.returning.mockResolvedValue([updatedItem]);

      const result = await repository.update(1, itemToUpdate);

      expect(result).toEqual(updatedItem);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.update).toHaveBeenCalledWith({
        ...itemToUpdate,
        last_update: expect.any(Date),
        last_changed_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should use provided last_changed_by value', async () => {
      const itemToUpdate = {
        name: 'Updated Item',
        last_changed_by: 'test-user',
      };
      const updatedItem = { ...mockItem, ...itemToUpdate };
      mockTable.returning.mockResolvedValue([updatedItem]);

      const result = await repository.update(1, itemToUpdate);

      expect(result).toEqual(updatedItem);
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.update).toHaveBeenCalledWith({
        ...itemToUpdate,
        last_update: expect.any(Date),
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should return null when no item is updated', async () => {
      mockTable.returning.mockResolvedValue([]);

      const result = await repository.update(999, { name: 'Updated Item' });

      expect(result).toBeUndefined();
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 999);
      expect(mockTable.update).toHaveBeenCalledWith({
        name: 'Updated Item',
        last_update: expect.any(Date),
        last_changed_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.returning.mockRejectedValue(error);

      await expect(repository.update(1, { name: 'Updated Item' })).rejects.toThrow(
        'Database error',
      );
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.update).toHaveBeenCalledWith({
        name: 'Updated Item',
        last_update: expect.any(Date),
        last_changed_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      mockTable.delete.mockResolvedValue(1);

      await repository.remove(1);

      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.delete).toHaveBeenCalled();
    });

    it('should handle case when no item is removed', async () => {
      mockTable.delete.mockResolvedValue(0);

      await repository.remove(999);

      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 999);
      expect(mockTable.delete).toHaveBeenCalled();
    });

    it('should propagate database errors', async () => {
      const error = new Error('Database error');
      mockTable.delete.mockRejectedValue(error);

      await expect(repository.remove(1)).rejects.toThrow('Database error');
      expect(mockKnex.table).toHaveBeenCalledWith('items');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.delete).toHaveBeenCalled();
    });
  });
});
