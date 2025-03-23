import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoices.interface';
import { NotFoundException } from '@nestjs/common';

describe('InvoicesController', () => {
  let controller: InvoicesController;
  let service: InvoicesService;

  // Mock data
  const mockInvoices: Invoice[] = [
    {
      id: 1,
      alt_id: 'invoice-001',
      total: 100.50,
      paid: false,
      user_id: 'user-001',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
    {
      id: 2,
      alt_id: 'invoice-002',
      total: 200.75,
      paid: true,
      user_id: 'user-001',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
    {
      id: 3,
      alt_id: 'invoice-003',
      total: 150.25,
      paid: false,
      user_id: 'user-002',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
  ];

  const mockInvoice = mockInvoices[0];
  const mockInvoiceToCreate: Omit<Invoice, 'id' | 'alt_id'> = {
    total: 300.00,
    paid: false,
    user_id: 'user-003',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesController],
      providers: [
        {
          provide: InvoicesService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByAltId: jest.fn(),
            findByUserId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesController>(InvoicesController);
    service = module.get<InvoicesService>(InvoicesService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockInvoices);

      const result = await controller.findAll();

      expect(result).toEqual(mockInvoices);
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
    it('should return a single invoice by id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockInvoice);

      const result = await controller.findOne('1');

      expect(result).toEqual(mockInvoice);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException when invoice is not found', async () => {
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
    it('should return a single invoice by alt_id', async () => {
      jest.spyOn(service, 'findByAltId').mockResolvedValue(mockInvoice);

      const result = await controller.findByAltId('invoice-001');

      expect(result).toEqual(mockInvoice);
      expect(service.findByAltId).toHaveBeenCalledWith('invoice-001');
    });

    it('should throw NotFoundException when invoice is not found by alt_id', async () => {
      jest.spyOn(service, 'findByAltId').mockResolvedValue(null);

      await expect(controller.findByAltId('non-existent')).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findByAltId).toHaveBeenCalledWith('non-existent');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findByAltId').mockRejectedValue(error);

      await expect(controller.findByAltId('invoice-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.findByAltId).toHaveBeenCalledWith('invoice-001');
    });
  });

  describe('findByUserId', () => {
    it('should return invoices by user_id', async () => {
      const userInvoices = mockInvoices.filter(i => i.user_id === 'user-001');
      jest.spyOn(service, 'findByUserId').mockResolvedValue(userInvoices);

      const result = await controller.findByUserId('user-001');

      expect(result).toEqual(userInvoices);
      expect(service.findByUserId).toHaveBeenCalledWith('user-001');
    });

    it('should return empty array when no invoices found for user', async () => {
      jest.spyOn(service, 'findByUserId').mockResolvedValue([]);

      const result = await controller.findByUserId('non-existent');

      expect(result).toEqual([]);
      expect(service.findByUserId).toHaveBeenCalledWith('non-existent');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findByUserId').mockRejectedValue(error);

      await expect(controller.findByUserId('user-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.findByUserId).toHaveBeenCalledWith('user-001');
    });
  });

  describe('create', () => {
    it('should create and return a new invoice', async () => {
      const createdInvoice = {
        ...mockInvoiceToCreate,
        id: 4,
        alt_id: 'invoice-004',
      };
      jest.spyOn(service, 'create').mockResolvedValue(createdInvoice);

      const result = await controller.create(mockInvoiceToCreate);

      expect(result).toEqual(createdInvoice);
      expect(service.create).toHaveBeenCalledWith(mockInvoiceToCreate);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      await expect(controller.create(mockInvoiceToCreate)).rejects.toThrow(
        'Service error',
      );
      expect(service.create).toHaveBeenCalledWith(mockInvoiceToCreate);
    });
  });

  describe('update', () => {
    it('should update and return an invoice', async () => {
      const invoiceToUpdate = { total: 150.00 };
      const updatedInvoice = { ...mockInvoice, total: 150.00 };
      jest.spyOn(service, 'update').mockResolvedValue(updatedInvoice);

      const result = await controller.update('1', invoiceToUpdate);

      expect(result).toEqual(updatedInvoice);
      expect(service.update).toHaveBeenCalledWith(1, invoiceToUpdate);
    });

    it('should propagate errors from service', async () => {
      const invoiceToUpdate = { total: 150.00 };
      const error = new Error('Service error');
      jest.spyOn(service, 'update').mockRejectedValue(error);

      await expect(controller.update('1', invoiceToUpdate)).rejects.toThrow(
        'Service error',
      );
      expect(service.update).toHaveBeenCalledWith(1, invoiceToUpdate);
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
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