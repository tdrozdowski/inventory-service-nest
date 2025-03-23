import { Test, TestingModule } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { Item } from './items.interface';

// Mock the entire repository module to avoid import errors
jest.mock('./items.repository', () => {
  return {
    ItemsRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByAltId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    })),
  };
});

// Import after mocking
import { ItemsRepository } from './items.repository';

describe('ItemsService', () => {
  let service: ItemsService;
  let repository: ItemsRepository;

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

  // The repository is already mocked at the module level

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemsService, ItemsRepository],
    }).compile();

    service = module.get<ItemsService>(ItemsService);
    repository = module.get<ItemsRepository>(ItemsRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup the repository mock methods for each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      (repository.findAll as jest.Mock).mockResolvedValue(mockItems);

      const result = await service.findAll();

      expect(result).toEqual(mockItems);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no items exist', async () => {
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
    it('should return a single item by id', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockItem);

      const result = await service.findOne(1);

      expect(result).toEqual(mockItem);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should return null when item is not found', async () => {
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
    it('should return a single item by alt_id', async () => {
      (repository.findByAltId as jest.Mock).mockResolvedValue(mockItem);

      const result = await service.findByAltId('item-001');

      expect(result).toEqual(mockItem);
      expect(repository.findByAltId).toHaveBeenCalledWith('item-001');
    });

    it('should return null when item is not found by alt_id', async () => {
      (repository.findByAltId as jest.Mock).mockResolvedValue(null);

      const result = await service.findByAltId('non-existent');

      expect(result).toBeNull();
      expect(repository.findByAltId).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    it('should create and return a new item', async () => {
      const createdItem = { ...mockItemToCreate, id: 3, alt_id: 'item-003' };
      (repository.create as jest.Mock).mockResolvedValue(createdItem);

      const result = await service.create(mockItemToCreate);

      expect(result).toEqual(createdItem);
      expect(repository.create).toHaveBeenCalledWith(mockItemToCreate);
    });

    it('should handle validation errors during creation', async () => {
      const error = new Error('Validation error');
      (repository.create as jest.Mock).mockRejectedValue(error);

      await expect(service.create(mockItemToCreate)).rejects.toThrow(
        'Validation error',
      );
      expect(repository.create).toHaveBeenCalledWith(mockItemToCreate);
    });
  });

  describe('update', () => {
    it('should update and return an item', async () => {
      const itemToUpdate = { name: 'Updated Item' };
      const updatedItem = { ...mockItem, name: 'Updated Item' };
      (repository.update as jest.Mock).mockResolvedValue(updatedItem);

      const result = await service.update(1, itemToUpdate);

      expect(result).toEqual(updatedItem);
      expect(repository.update).toHaveBeenCalledWith(1, itemToUpdate);
    });

    it('should return null when trying to update a non-existent item', async () => {
      const itemToUpdate = { name: 'Updated Item' };
      (repository.update as jest.Mock).mockResolvedValue(null);

      const result = await service.update(999, itemToUpdate);

      expect(result).toBeNull();
      expect(repository.update).toHaveBeenCalledWith(999, itemToUpdate);
    });

    it('should handle errors during update', async () => {
      const itemToUpdate = { name: 'Updated Item' };
      const error = new Error('Update error');
      (repository.update as jest.Mock).mockRejectedValue(error);

      await expect(service.update(1, itemToUpdate)).rejects.toThrow(
        'Update error',
      );
      expect(repository.update).toHaveBeenCalledWith(1, itemToUpdate);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
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
