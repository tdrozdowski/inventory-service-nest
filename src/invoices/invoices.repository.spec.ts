import { InvoicesRepository } from './invoices.repository';
import { Invoice } from './invoices.interface';

// Mock the InjectConnection decorator
jest.mock('nest-knexjs', () => ({
  InjectConnection: () => () => {},
}));

describe('InvoicesRepository', () => {
  let repository: InvoicesRepository;
  let mockKnex: any;
  let mockTable: any;

  // Mock data
  const mockInvoices: Invoice[] = [
    {
      id: 1,
      alt_id: 'invoice-001',
      total: 100.5,
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
    repository = new InvoicesRepository(mockKnex);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoices', async () => {
      mockTable.select.mockImplementation(() => mockInvoices);

      const result = await repository.findAll();

      expect(result).toEqual(mockInvoices);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices');
      expect(mockTable.select).toHaveBeenCalledWith('*');
    });
  });

  describe('findOne', () => {
    it('should return a single invoice by id', async () => {
      mockTable.first.mockResolvedValue(mockInvoice);

      const result = await repository.findOne(1);

      expect(result).toEqual(mockInvoice);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.first).toHaveBeenCalled();
    });
  });

  describe('findByAltId', () => {
    it('should return a single invoice by alt_id', async () => {
      mockTable.first.mockResolvedValue(mockInvoice);

      const result = await repository.findByAltId('invoice-001');

      expect(result).toEqual(mockInvoice);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices');
      expect(mockTable.where).toHaveBeenCalledWith('alt_id', 'invoice-001');
      expect(mockTable.first).toHaveBeenCalled();
    });
  });

  describe('findByUserId', () => {
    it('should return invoices by user_id', async () => {
      const userInvoices = mockInvoices.filter((i) => i.user_id === 'user-001');
      mockTable.where.mockImplementation(() => userInvoices);

      const result = await repository.findByUserId('user-001');

      expect(result).toEqual(userInvoices);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices');
      expect(mockTable.where).toHaveBeenCalledWith('user_id', 'user-001');
    });
  });

  describe('create', () => {
    it('should create and return a new invoice', async () => {
      const invoiceToCreate = {
        total: 300.0,
        paid: false,
        user_id: 'user-003',
      };
      const createdInvoice = {
        ...invoiceToCreate,
        id: 4,
        alt_id: 'invoice-004',
        created_by: 'system',
      };
      mockTable.returning.mockResolvedValue([createdInvoice]);

      const result = await repository.create(invoiceToCreate);

      expect(result).toEqual(createdInvoice);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices');
      expect(mockTable.insert).toHaveBeenCalledWith({
        ...invoiceToCreate,
        created_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });
  });

  describe('update', () => {
    it('should update and return an invoice', async () => {
      const invoiceToUpdate = { total: 150.0 };
      const updatedInvoice = { ...mockInvoice, total: 150.0 };
      mockTable.returning.mockResolvedValue([updatedInvoice]);

      const result = await repository.update(1, invoiceToUpdate);

      expect(result).toEqual(updatedInvoice);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.update).toHaveBeenCalledWith({
        ...invoiceToUpdate,
        last_update: expect.any(Date),
        last_changed_by: 'system',
      });
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });
  });

  describe('remove', () => {
    it('should remove an invoice', async () => {
      mockTable.delete.mockResolvedValue(1);

      await repository.remove(1);

      expect(mockKnex.table).toHaveBeenCalledWith('invoices');
      expect(mockTable.where).toHaveBeenCalledWith('id', 1);
      expect(mockTable.delete).toHaveBeenCalled();
    });
  });
});
