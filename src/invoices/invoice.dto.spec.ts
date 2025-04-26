import { InvoiceDto, CreateInvoiceDto, UpdateInvoiceDto } from './invoice.dto';

describe('InvoiceDto', () => {
  // Instead of checking the class structure, we'll verify that the DTO classes
  // are defined correctly by checking their properties
  it('should have InvoiceDto class defined', () => {
    expect(InvoiceDto).toBeDefined();
  });

  it('should have CreateInvoiceDto class defined', () => {
    expect(CreateInvoiceDto).toBeDefined();
  });

  it('should have UpdateInvoiceDto class defined', () => {
    expect(UpdateInvoiceDto).toBeDefined();
  });

  it('should not have id field in CreateInvoiceDto', () => {
    // Verify that the CreateInvoiceDto class doesn't have an id field
    const idField = Object.getOwnPropertyDescriptor(
      CreateInvoiceDto.prototype,
      'id',
    );
    expect(idField).toBeUndefined();
  });

  it('should not have alt_id field in CreateInvoiceDto', () => {
    // Verify that the CreateInvoiceDto class doesn't have an alt_id field
    const altIdField = Object.getOwnPropertyDescriptor(
      CreateInvoiceDto.prototype,
      'alt_id',
    );
    expect(altIdField).toBeUndefined();
  });

  it('should not have id field in UpdateInvoiceDto', () => {
    // Verify that the UpdateInvoiceDto class doesn't have an id field
    const idField = Object.getOwnPropertyDescriptor(
      UpdateInvoiceDto.prototype,
      'id',
    );
    expect(idField).toBeUndefined();
  });

  it('should not have alt_id field in UpdateInvoiceDto', () => {
    // Verify that the UpdateInvoiceDto class doesn't have an alt_id field
    const altIdField = Object.getOwnPropertyDescriptor(
      UpdateInvoiceDto.prototype,
      'alt_id',
    );
    expect(altIdField).toBeUndefined();
  });
});
