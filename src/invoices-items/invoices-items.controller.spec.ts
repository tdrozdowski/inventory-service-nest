import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesItemsController } from './invoices-items.controller';
import { InvoicesItemsService } from './invoices-items.service';
import { InvoiceItem } from './invoices-items.interface';
import { NotFoundException } from '@nestjs/common';

describe('InvoicesItemsController', () => {
  let controller: InvoicesItemsController;
  let service: InvoicesItemsService;

  // Mock data
  const mockInvoiceItems: InvoiceItem[] = [
    {
      invoice_id: 'invoice-001',
      item_id: 'item-001',
    },
    {
      invoice_id: 'invoice-001',
      item_id: 'item-002',
    },
    {
      invoice_id: 'invoice-002',
      item_id: 'item-001',
    },
  ];

  const mockInvoiceItem = mockInvoiceItems[0];
  const mockInvoiceItemToCreate: InvoiceItem = {
    invoice_id: 'invoice-003',
    item_id: 'item-003',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvoicesItemsController],
      providers: [
        {
          provide: InvoicesItemsService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            findByInvoiceId: jest.fn(),
            findByItemId: jest.fn(),
            create: jest.fn(),
            remove: jest.fn(),
            removeByInvoiceId: jest.fn(),
            removeByItemId: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<InvoicesItemsController>(InvoicesItemsController);
    service = module.get<InvoicesItemsService>(InvoicesItemsService);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoice items', async () => {
      jest.spyOn(service, 'findAll').mockResolvedValue(mockInvoiceItems);

      const result = await controller.findAll();

      expect(result).toEqual(mockInvoiceItems);
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

  describe('findByInvoiceId', () => {
    it('should return invoice items by invoice_id', async () => {
      const invoiceItems = mockInvoiceItems.filter(
        (i) => i.invoice_id === 'invoice-001',
      );
      jest.spyOn(service, 'findByInvoiceId').mockResolvedValue(invoiceItems);

      const result = await controller.findByInvoiceId('invoice-001');

      expect(result).toEqual(invoiceItems);
      expect(service.findByInvoiceId).toHaveBeenCalledWith('invoice-001');
    });

    it('should return empty array when no invoice items found for invoice', async () => {
      jest.spyOn(service, 'findByInvoiceId').mockResolvedValue([]);

      const result = await controller.findByInvoiceId('non-existent');

      expect(result).toEqual([]);
      expect(service.findByInvoiceId).toHaveBeenCalledWith('non-existent');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findByInvoiceId').mockRejectedValue(error);

      await expect(controller.findByInvoiceId('invoice-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.findByInvoiceId).toHaveBeenCalledWith('invoice-001');
    });
  });

  describe('findByItemId', () => {
    it('should return invoice items by item_id', async () => {
      const invoiceItems = mockInvoiceItems.filter(
        (i) => i.item_id === 'item-001',
      );
      jest.spyOn(service, 'findByItemId').mockResolvedValue(invoiceItems);

      const result = await controller.findByItemId('item-001');

      expect(result).toEqual(invoiceItems);
      expect(service.findByItemId).toHaveBeenCalledWith('item-001');
    });

    it('should return empty array when no invoice items found for item', async () => {
      jest.spyOn(service, 'findByItemId').mockResolvedValue([]);

      const result = await controller.findByItemId('non-existent');

      expect(result).toEqual([]);
      expect(service.findByItemId).toHaveBeenCalledWith('non-existent');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findByItemId').mockRejectedValue(error);

      await expect(controller.findByItemId('item-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.findByItemId).toHaveBeenCalledWith('item-001');
    });
  });

  describe('findOne', () => {
    it('should return a single invoice item by invoice_id and item_id', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockInvoiceItem);

      const result = await controller.findOne('invoice-001', 'item-001');

      expect(result).toEqual(mockInvoiceItem);
      expect(service.findOne).toHaveBeenCalledWith('invoice-001', 'item-001');
    });

    it('should throw NotFoundException when invoice item is not found', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(null);

      await expect(
        controller.findOne('non-existent', 'non-existent'),
      ).rejects.toThrow(NotFoundException);
      expect(service.findOne).toHaveBeenCalledWith(
        'non-existent',
        'non-existent',
      );
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'findOne').mockRejectedValue(error);

      await expect(
        controller.findOne('invoice-001', 'item-001'),
      ).rejects.toThrow('Service error');
      expect(service.findOne).toHaveBeenCalledWith('invoice-001', 'item-001');
    });
  });

  describe('create', () => {
    it('should create and return a new invoice item', async () => {
      jest.spyOn(service, 'create').mockResolvedValue(mockInvoiceItemToCreate);

      const result = await controller.create(mockInvoiceItemToCreate);

      expect(result).toEqual(mockInvoiceItemToCreate);
      expect(service.create).toHaveBeenCalledWith(mockInvoiceItemToCreate);
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'create').mockRejectedValue(error);

      await expect(controller.create(mockInvoiceItemToCreate)).rejects.toThrow(
        'Service error',
      );
      expect(service.create).toHaveBeenCalledWith(mockInvoiceItemToCreate);
    });
  });

  describe('removeByInvoiceId', () => {
    it('should remove invoice items by invoice_id', async () => {
      jest.spyOn(service, 'removeByInvoiceId').mockResolvedValue(undefined);

      await controller.removeByInvoiceId('invoice-001');

      expect(service.removeByInvoiceId).toHaveBeenCalledWith('invoice-001');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'removeByInvoiceId').mockRejectedValue(error);

      await expect(controller.removeByInvoiceId('invoice-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.removeByInvoiceId).toHaveBeenCalledWith('invoice-001');
    });
  });

  describe('removeByItemId', () => {
    it('should remove invoice items by item_id', async () => {
      jest.spyOn(service, 'removeByItemId').mockResolvedValue(undefined);

      await controller.removeByItemId('item-001');

      expect(service.removeByItemId).toHaveBeenCalledWith('item-001');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'removeByItemId').mockRejectedValue(error);

      await expect(controller.removeByItemId('item-001')).rejects.toThrow(
        'Service error',
      );
      expect(service.removeByItemId).toHaveBeenCalledWith('item-001');
    });
  });

  describe('remove', () => {
    it('should remove an invoice item by invoice_id and item_id', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined);

      await controller.remove('invoice-001', 'item-001');

      expect(service.remove).toHaveBeenCalledWith('invoice-001', 'item-001');
    });

    it('should propagate errors from service', async () => {
      const error = new Error('Service error');
      jest.spyOn(service, 'remove').mockRejectedValue(error);

      await expect(
        controller.remove('invoice-001', 'item-001'),
      ).rejects.toThrow('Service error');
      expect(service.remove).toHaveBeenCalledWith('invoice-001', 'item-001');
    });
  });
});
