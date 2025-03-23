import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesItemsService } from './invoices-items.service';
import { InvoiceItem } from './invoices-items.interface';

// Mock the entire repository module to avoid import errors
jest.mock('./invoices-items.repository', () => {
  return {
    InvoicesItemsRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn(),
      findByInvoiceId: jest.fn(),
      findByItemId: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
      removeByInvoiceId: jest.fn(),
      removeByItemId: jest.fn(),
    })),
  };
});

// Import after mocking
import { InvoicesItemsRepository } from './invoices-items.repository';

describe('InvoicesItemsService', () => {
  let service: InvoicesItemsService;
  let repository: InvoicesItemsRepository;

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

  // The repository is already mocked at the module level

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesItemsService, InvoicesItemsRepository],
    }).compile();

    service = module.get<InvoicesItemsService>(InvoicesItemsService);
    repository = module.get<InvoicesItemsRepository>(InvoicesItemsRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup the repository mock methods for each test
    const repositoryInstance = repository as unknown as {
      findAll: jest.Mock;
      findByInvoiceId: jest.Mock;
      findByItemId: jest.Mock;
      findOne: jest.Mock;
      create: jest.Mock;
      remove: jest.Mock;
      removeByInvoiceId: jest.Mock;
      removeByItemId: jest.Mock;
    };
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoice items', async () => {
      (repository.findAll as jest.Mock).mockResolvedValue(mockInvoiceItems);

      const result = await service.findAll();

      expect(result).toEqual(mockInvoiceItems);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no invoice items exist', async () => {
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

  describe('findByInvoiceId', () => {
    it('should return invoice items for a specific invoice', async () => {
      const invoiceItems = mockInvoiceItems.filter(
        (item) => item.invoice_id === 'invoice-001',
      );
      (repository.findByInvoiceId as jest.Mock).mockResolvedValue(invoiceItems);

      const result = await service.findByInvoiceId('invoice-001');

      expect(result).toEqual(invoiceItems);
      expect(repository.findByInvoiceId).toHaveBeenCalledWith('invoice-001');
    });

    it('should return an empty array when no invoice items exist for the invoice', async () => {
      (repository.findByInvoiceId as jest.Mock).mockResolvedValue([]);

      const result = await service.findByInvoiceId('non-existent');

      expect(result).toEqual([]);
      expect(repository.findByInvoiceId).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('findByItemId', () => {
    it('should return invoice items for a specific item', async () => {
      const invoiceItems = mockInvoiceItems.filter(
        (item) => item.item_id === 'item-001',
      );
      (repository.findByItemId as jest.Mock).mockResolvedValue(invoiceItems);

      const result = await service.findByItemId('item-001');

      expect(result).toEqual(invoiceItems);
      expect(repository.findByItemId).toHaveBeenCalledWith('item-001');
    });

    it('should return an empty array when no invoice items exist for the item', async () => {
      (repository.findByItemId as jest.Mock).mockResolvedValue([]);

      const result = await service.findByItemId('non-existent');

      expect(result).toEqual([]);
      expect(repository.findByItemId).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('findOne', () => {
    it('should return a single invoice item', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockInvoiceItem);

      const result = await service.findOne('invoice-001', 'item-001');

      expect(result).toEqual(mockInvoiceItem);
      expect(repository.findOne).toHaveBeenCalledWith(
        'invoice-001',
        'item-001',
      );
    });

    it('should return null when invoice item is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne('non-existent', 'non-existent');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith(
        'non-existent',
        'non-existent',
      );
    });
  });

  describe('create', () => {
    it('should create and return a new invoice item', async () => {
      (repository.create as jest.Mock).mockResolvedValue(
        mockInvoiceItemToCreate,
      );

      const result = await service.create(mockInvoiceItemToCreate);

      expect(result).toEqual(mockInvoiceItemToCreate);
      expect(repository.create).toHaveBeenCalledWith(mockInvoiceItemToCreate);
    });

    it('should handle validation errors during creation', async () => {
      const error = new Error('Validation error');
      (repository.create as jest.Mock).mockRejectedValue(error);

      await expect(service.create(mockInvoiceItemToCreate)).rejects.toThrow(
        'Validation error',
      );
      expect(repository.create).toHaveBeenCalledWith(mockInvoiceItemToCreate);
    });
  });

  describe('remove', () => {
    it('should remove an invoice item', async () => {
      (repository.remove as jest.Mock).mockResolvedValue(undefined);

      await service.remove('invoice-001', 'item-001');

      expect(repository.remove).toHaveBeenCalledWith('invoice-001', 'item-001');
    });

    it('should handle errors during removal', async () => {
      const error = new Error('Removal error');
      (repository.remove as jest.Mock).mockRejectedValue(error);

      await expect(service.remove('invoice-001', 'item-001')).rejects.toThrow(
        'Removal error',
      );
      expect(repository.remove).toHaveBeenCalledWith('invoice-001', 'item-001');
    });
  });

  describe('removeByInvoiceId', () => {
    it('should remove all invoice items for a specific invoice', async () => {
      (repository.removeByInvoiceId as jest.Mock).mockResolvedValue(undefined);

      await service.removeByInvoiceId('invoice-001');

      expect(repository.removeByInvoiceId).toHaveBeenCalledWith('invoice-001');
    });

    it('should handle errors during removal by invoice ID', async () => {
      const error = new Error('Removal error');
      (repository.removeByInvoiceId as jest.Mock).mockRejectedValue(error);

      await expect(service.removeByInvoiceId('invoice-001')).rejects.toThrow(
        'Removal error',
      );
      expect(repository.removeByInvoiceId).toHaveBeenCalledWith('invoice-001');
    });
  });

  describe('removeByItemId', () => {
    it('should remove all invoice items for a specific item', async () => {
      (repository.removeByItemId as jest.Mock).mockResolvedValue(undefined);

      await service.removeByItemId('item-001');

      expect(repository.removeByItemId).toHaveBeenCalledWith('item-001');
    });

    it('should handle errors during removal by item ID', async () => {
      const error = new Error('Removal error');
      (repository.removeByItemId as jest.Mock).mockRejectedValue(error);

      await expect(service.removeByItemId('item-001')).rejects.toThrow(
        'Removal error',
      );
      expect(repository.removeByItemId).toHaveBeenCalledWith('item-001');
    });
  });
});
