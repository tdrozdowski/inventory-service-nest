import { Test, TestingModule } from '@nestjs/testing';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoices.interface';

// Mock the entire repository module to avoid import errors
jest.mock('./invoices.repository', () => {
  return {
    InvoicesRepository: jest.fn().mockImplementation(() => ({
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByAltId: jest.fn(),
      findByUserId: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
    })),
  };
});

// Import after mocking
import { InvoicesRepository } from './invoices.repository';

describe('InvoicesService', () => {
  let service: InvoicesService;
  let repository: InvoicesRepository;

  // Mock data
  const mockInvoices: Invoice[] = [
    {
      id: '1',
      alt_id: 'invoice-001',
      total: 100.5,
      paid: false,
      user_id: 'person-001',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
    {
      id: '2',
      alt_id: 'invoice-002',
      total: 200.75,
      paid: true,
      user_id: 'person-002',
      created_by: 'system',
      created_at: new Date(),
      last_update: new Date(),
      last_changed_by: 'system',
    },
  ];

  const mockInvoice = mockInvoices[0];
  const mockInvoiceToCreate: Omit<Invoice, 'id' | 'alt_id'> = {
    total: 150.25,
    paid: false,
    user_id: 'person-001',
  };

  // The repository is already mocked at the module level

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvoicesService, InvoicesRepository],
    }).compile();

    service = module.get<InvoicesService>(InvoicesService);
    repository = module.get<InvoicesRepository>(InvoicesRepository);

    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup the repository mock methods for each test
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      (repository.findAll as jest.Mock).mockResolvedValue(mockInvoices);

      const result = await service.findAll();

      expect(result).toEqual(mockInvoices);
      expect(repository.findAll).toHaveBeenCalledTimes(1);
    });

    it('should return an empty array when no invoices exist', async () => {
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
    it('should return a single invoice by id', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await service.findOne('1');

      expect(result).toEqual(mockInvoice);
      expect(repository.findOne).toHaveBeenCalledWith('1');
    });

    it('should return null when invoice is not found', async () => {
      (repository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await service.findOne('999');

      expect(result).toBeNull();
      expect(repository.findOne).toHaveBeenCalledWith('999');
    });

    it('should propagate errors from the repository', async () => {
      const error = new Error('Database error');
      (repository.findOne as jest.Mock).mockRejectedValue(error);

      await expect(service.findOne('1')).rejects.toThrow('Database error');
      expect(repository.findOne).toHaveBeenCalledWith('1');
    });
  });

  describe('findByAltId', () => {
    it('should return a single invoice by alt_id', async () => {
      (repository.findByAltId as jest.Mock).mockResolvedValue(mockInvoice);

      const result = await service.findByAltId('invoice-001');

      expect(result).toEqual(mockInvoice);
      expect(repository.findByAltId).toHaveBeenCalledWith('invoice-001');
    });

    it('should return null when invoice is not found by alt_id', async () => {
      (repository.findByAltId as jest.Mock).mockResolvedValue(null);

      const result = await service.findByAltId('non-existent');

      expect(result).toBeNull();
      expect(repository.findByAltId).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('findByUserId', () => {
    it('should return invoices for a specific user', async () => {
      (repository.findByUserId as jest.Mock).mockResolvedValue([mockInvoice]);

      const result = await service.findByUserId('person-001');

      expect(result).toEqual([mockInvoice]);
      expect(repository.findByUserId).toHaveBeenCalledWith('person-001');
    });

    it('should return an empty array when no invoices exist for the user', async () => {
      (repository.findByUserId as jest.Mock).mockResolvedValue([]);

      const result = await service.findByUserId('non-existent');

      expect(result).toEqual([]);
      expect(repository.findByUserId).toHaveBeenCalledWith('non-existent');
    });
  });

  describe('create', () => {
    it('should create and return a new invoice', async () => {
      const createdInvoice = {
        ...mockInvoiceToCreate,
        id: '3',
        alt_id: 'invoice-003',
      };
      (repository.create as jest.Mock).mockResolvedValue(createdInvoice);

      const result = await service.create(mockInvoiceToCreate);

      expect(result).toEqual(createdInvoice);
      expect(repository.create).toHaveBeenCalledWith(mockInvoiceToCreate);
    });

    it('should handle validation errors during creation', async () => {
      const error = new Error('Validation error');
      (repository.create as jest.Mock).mockRejectedValue(error);

      await expect(service.create(mockInvoiceToCreate)).rejects.toThrow(
        'Validation error',
      );
      expect(repository.create).toHaveBeenCalledWith(mockInvoiceToCreate);
    });
  });

  describe('update', () => {
    it('should update and return an invoice', async () => {
      const invoiceToUpdate = { total: 300.0 };
      const updatedInvoice = { ...mockInvoice, total: 300.0 };
      (repository.update as jest.Mock).mockResolvedValue(updatedInvoice);

      const result = await service.update('1', invoiceToUpdate);

      expect(result).toEqual(updatedInvoice);
      expect(repository.update).toHaveBeenCalledWith('1', invoiceToUpdate);
    });

    it('should return null when trying to update a non-existent invoice', async () => {
      const invoiceToUpdate = { total: 300.0 };
      (repository.update as jest.Mock).mockResolvedValue(null);

      const result = await service.update('999', invoiceToUpdate);

      expect(result).toBeNull();
      expect(repository.update).toHaveBeenCalledWith('999', invoiceToUpdate);
    });

    it('should handle errors during update', async () => {
      const invoiceToUpdate = { total: 300.0 };
      const error = new Error('Update error');
      (repository.update as jest.Mock).mockRejectedValue(error);

      await expect(service.update('1', invoiceToUpdate)).rejects.toThrow(
        'Update error',
      );
      expect(repository.update).toHaveBeenCalledWith('1', invoiceToUpdate);
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
      (repository.remove as jest.Mock).mockResolvedValue(undefined);

      await service.remove('1');

      expect(repository.remove).toHaveBeenCalledWith('1');
    });

    it('should handle errors during removal', async () => {
      const error = new Error('Removal error');
      (repository.remove as jest.Mock).mockRejectedValue(error);

      await expect(service.remove('1')).rejects.toThrow('Removal error');
      expect(repository.remove).toHaveBeenCalledWith('1');
    });
  });
});
