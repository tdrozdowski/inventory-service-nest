import { Test, TestingModule } from '@nestjs/testing';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { Item } from './items.interface';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;

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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemsController],
      providers: [
        {
          provide: ItemsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByAltId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
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
      jest.spyOn(service, 'findAll').mockResolvedValue(mockItems);

      const result = await controller.findAll();

      expect(result).toEqual(mockItems);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should handle empty array', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      const result = await controller.findAll();

      expect(result).toEqual([]);
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findAll').mockRejectedValue(error);

      await expect(controller.findAll()).rejects.toThrow('Service error');
      expect(service.findAll).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('should return a single item by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockItem);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockItem);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when item is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(999);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(controller.findOne('1')).rejects.toThrow('Service error');
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('findByAltId', () => {
    it('should return a single item by alt_id', async () => {
      jest.spyOn(service, 'findByAltId').mockResolvedValue(mockItem);

      const result = await controller.findByAltId('item-001');

      expect(result).toEqual(mockItem);
      expect(service.findByAltId).toHaveBeenCalledWith('item-001');
    });

    it('should throw NotFoundException when item is not found by alt_id', async () => {
      jest.spyOn(service, 'findByAltId').mockResolvedValue(null);

      await expect(controller.findByAltId('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByAltId).toHaveBeenCalledWith('non-existent');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findByAltId').mockRejectedValue(error);

      await expect(controller.findByAltId('item-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.findByAltId).toHaveBeenCalledWith('item-001');
    });
  });

  describe('create', () => {
    it('should create and return a new item', async () => {
      const createdItem = { ...mockItemToCreate, id: 3, alt_id: 'item-003' };
      jest.spyOn(service, 'create').mockResolvedValue(createdItem);

      const result = await controller.create(mockItemToCreate);

      expect(result).toEqual(createdItem);
      expect(service.create).toHaveBeenCalledWith(mockItemToCreate);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      await expect(controller.create(mockItemToCreate)).rejects.toThrow(
        'Service error',
      );
      expect(service.create).toHaveBeenCalledWith(mockItemToCreate);
    });
  });

  describe('update', () => {
    it('should update and return an item', async () => {
      const itemToUpdate = { name: 'Updated Item' };
      const updatedItem = { ...mockItem, name: 'Updated Item' };
      jest.spyOn(service, 'update').mockResolvedValue(updatedItem);

      const result = await controller.update('1', itemToUpdate);

      expect(result).toEqual(updatedItem);
      expect(service.update).toHaveBeenCalledWith(1, itemToUpdate);
    });

    it('should throw BadRequestException for invalid ID', async () => {
      const itemToUpdate = { name: 'Updated Item' };

      await expect(controller.update('invalid', itemToUpdate)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.update).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException when item is not found', async () => {
      const itemToUpdate = { name: 'Updated Item' };
      jest.spyOn(service, 'update').mockResolvedValue(null);

      await expect(controller.update('999', itemToUpdate)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.update).toHaveBeenCalledWith(999, itemToUpdate);
    });

    it('should propagate errors from service', async () => {
      const itemToUpdate = { name: 'Updated Item' };
      const error = new Error('Service error');
      jest.spyOn(service, 'update').mockRejectedValue(error);

      await expect(controller.update('1', itemToUpdate)).rejects.toThrow(
        'Service error',
      );
      expect(service.update).toHaveBeenCalledWith(1, itemToUpdate);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('1');

      expect(service.remove).toHaveBeenCalledWith(1);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'remove').mockRejectedValue(error);

      await expect(controller.remove('1')).rejects.toThrow('Service error');
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});