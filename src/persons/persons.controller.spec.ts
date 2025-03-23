import { Test, TestingModule } from '@nestjs/testing';
import { PersonsController } from './persons.controller';
import { PersonsService } from './persons.service';
import { Person } from './persons.interface';
import { NotFoundException } from '@nestjs/common';

describe('PersonsController', () => {
  let controller: PersonsController;
  let service: PersonsService;

  // Mock data
  const mockPersons: Person[] = [
    {
      id: 1,
      alt_id: 'person-001',
      name: 'John Doe',
      email: 'john.doe@example.com',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
    {
      id: 2,
      alt_id: 'person-002',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
  ];

  const mockPerson = mockPersons[0];
  const mockPersonToCreate: Omit<Person, 'id' | 'alt_id'> = {
    name: 'New Person',
    email: 'new.person@example.com',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PersonsController],
      providers: [
        {
          provide: PersonsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByAltId: jest.fn(),
            findByEmail: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PersonsController>(PersonsController);
    service = module.get<PersonsService>(PersonsService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of persons', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockPersons);

      const result = await controller.findAll();

      expect(result).toEqual(mockPersons);
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
    it('should return a single person by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockPerson);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockPerson);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when person is not found', async () => {
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
    it('should return a single person by alt_id', async () => {
      jest.spyOn(service, 'findByAltId').mockResolvedValue(mockPerson);

      const result = await controller.findByAltId('person-001');

      expect(result).toEqual(mockPerson);
      expect(service.findByAltId).toHaveBeenCalledWith('person-001');
    });

    it('should throw NotFoundException when person is not found by alt_id', async () => {
      jest.spyOn(service, 'findByAltId').mockResolvedValue(null);

      await expect(controller.findByAltId('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByAltId).toHaveBeenCalledWith('non-existent');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findByAltId').mockRejectedValue(error);

      await expect(controller.findByAltId('person-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.findByAltId).toHaveBeenCalledWith('person-001');
    });
  });

  describe('findByEmail', () => {
    it('should return a single person by email', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(mockPerson);

      const result = await controller.findByEmail('john.doe@example.com');

      expect(result).toEqual(mockPerson);
      expect(service.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    });

    it('should throw NotFoundException when person is not found by email', async () => {
      jest.spyOn(service, 'findByEmail').mockResolvedValue(null);

      await expect(
        controller.findByEmail('non-existent@example.com'),
      ).rejects.toThrow(NotFoundException);
      expect(service.findByEmail).toHaveBeenCalledWith(
        'non-existent@example.com',
      );
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findByEmail').mockRejectedValue(error);

      await expect(
        controller.findByEmail('john.doe@example.com'),
      ).rejects.toThrow('Service error');
      expect(service.findByEmail).toHaveBeenCalledWith('john.doe@example.com');
    });
  });

  describe('create', () => {
    it('should create and return a new person', async () => {
      const createdPerson = {
        ...mockPersonToCreate,
        id: 3,
        alt_id: 'person-003',
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdPerson);

      const result = await controller.create(mockPersonToCreate);

      expect(result).toEqual(createdPerson);
      expect(service.create).toHaveBeenCalledWith(mockPersonToCreate);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      await expect(controller.create(mockPersonToCreate)).rejects.toThrow(
        'Service error',
      );
      expect(service.create).toHaveBeenCalledWith(mockPersonToCreate);
    });
  });

  describe('update', () => {
    it('should update and return a person', async () => {
      const personToUpdate = { name: 'Updated Name' };
      const updatedPerson = { ...mockPerson, name: 'Updated Name' };
      jest.spyOn(service, 'update').mockResolvedValue(updatedPerson);

      const result = await controller.update('1', personToUpdate);

      expect(result).toEqual(updatedPerson);
      expect(service.update).toHaveBeenCalledWith(1, personToUpdate);
    });

    it('should propagate errors from service', async () => {
      const personToUpdate = { name: 'Updated Name' };
      const error = new Error('Service error');
      jest.spyOn(service, 'update').mockRejectedValue(error);

      await expect(controller.update('1', personToUpdate)).rejects.toThrow(
        'Service error',
      );
      expect(service.update).toHaveBeenCalledWith(1, personToUpdate);
    });
  });

  describe('remove', () => {
    it('should remove a person', async () => {
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
