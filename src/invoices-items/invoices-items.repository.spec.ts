import { InvoicesItemsRepository } from './invoices-items.repository';
import { InvoiceItem } from './invoices-items.interface';

// Mock the InjectConnection decorator
jest.mock('nest-knexjs', () => ({
  InjectConnection: () => () => {},
}));

describe('InvoicesItemsRepository', () => {
  let repository: InvoicesItemsRepository;
  let mockKnex: any;
  let mockTable: any;

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

  beforeEach(() => {
    // Create mock for Knex query builder chain
    mockTable = {
      select: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      first: jest.fn(),
      insert: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      returning: jest.fn().mockReturnThis(),
    };

    // Create mock for Knex instance
    mockKnex = {
      table: jest.fn().mockReturnValue(mockTable),
    };

    // Directly instantiate the repository with the mock Knex instance
    repository = new InvoicesItemsRepository(mockKnex);

    // Reset all mocks before each test
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of invoice items', async () => {
      mockTable.select.mockImplementation(() => mockInvoiceItems);

      const result = await repository.findAll();

      expect(result).toEqual(mockInvoiceItems);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.select).toHaveBeenCalledWith('*');
    });
  });

  describe('findByInvoiceId', () => {
    it('should return invoice items by invoice_id', async () => {
      const invoiceItems = mockInvoiceItems.filter(
        (i) => i.invoice_id === 'invoice-001',
      );
      mockTable.where.mockImplementation(() => invoiceItems);

      const result = await repository.findByInvoiceId('invoice-001');

      expect(result).toEqual(invoiceItems);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.where).toHaveBeenCalledWith('invoice_id', 'invoice-001');
    });
  });

  describe('findByItemId', () => {
    it('should return invoice items by item_id', async () => {
      const invoiceItems = mockInvoiceItems.filter(
        (i) => i.item_id === 'item-001',
      );
      mockTable.where.mockImplementation(() => invoiceItems);

      const result = await repository.findByItemId('item-001');

      expect(result).toEqual(invoiceItems);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.where).toHaveBeenCalledWith('item_id', 'item-001');
    });
  });

  describe('findOne', () => {
    it('should return a single invoice item by invoice_id and item_id', async () => {
      mockTable.first.mockResolvedValue(mockInvoiceItem);

      const result = await repository.findOne('invoice-001', 'item-001');

      expect(result).toEqual(mockInvoiceItem);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.where).toHaveBeenCalledWith({
        invoice_id: 'invoice-001',
        item_id: 'item-001',
      });
      expect(mockTable.first).toHaveBeenCalled();
    });
  });

  describe('create', () => {
    it('should create and return a new invoice item', async () => {
      const invoiceItemToCreate = {
        invoice_id: 'invoice-003',
        item_id: 'item-003',
      };
      mockTable.returning.mockResolvedValue([invoiceItemToCreate]);

      const result = await repository.create(invoiceItemToCreate);

      expect(result).toEqual(invoiceItemToCreate);
      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.insert).toHaveBeenCalledWith(invoiceItemToCreate);
      expect(mockTable.returning).toHaveBeenCalledWith('*');
    });
  });

  describe('remove', () => {
    it('should remove an invoice item by invoice_id and item_id', async () => {
      mockTable.delete.mockResolvedValue(1);

      await repository.remove('invoice-001', 'item-001');

      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.where).toHaveBeenCalledWith({
        invoice_id: 'invoice-001',
        item_id: 'item-001',
      });
      expect(mockTable.delete).toHaveBeenCalled();
    });
  });

  describe('removeByInvoiceId', () => {
    it('should remove invoice items by invoice_id', async () => {
      mockTable.delete.mockResolvedValue(2);

      await repository.removeByInvoiceId('invoice-001');

      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.where).toHaveBeenCalledWith('invoice_id', 'invoice-001');
      expect(mockTable.delete).toHaveBeenCalled();
    });
  });

  describe('removeByItemId', () => {
    it('should remove invoice items by item_id', async () => {
      mockTable.delete.mockResolvedValue(2);

      await repository.removeByItemId('item-001');

      expect(mockKnex.table).toHaveBeenCalledWith('invoices_items');
      expect(mockTable.where).toHaveBeenCalledWith('item_id', 'item-001');
      expect(mockTable.delete).toHaveBeenCalled();
    });
  });
});
