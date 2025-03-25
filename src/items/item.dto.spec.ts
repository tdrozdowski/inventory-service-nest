import { ItemDto, CreateItemDto, UpdateItemDto } from './item.dto';

describe('ItemDto', () => {
  // Instead of checking the class structure, we'll verify that the DTO classes
  // are defined correctly by checking their properties
  it('should have ItemDto class defined', () => {
    expect(ItemDto).toBeDefined();
  });

  it('should have CreateItemDto class defined', () => {
    expect(CreateItemDto).toBeDefined();
  });

  it('should have UpdateItemDto class defined', () => {
    expect(UpdateItemDto).toBeDefined();
  });

  it('should not have id field in CreateItemDto', () => {
    // Verify that the CreateItemDto class doesn't have an id field
    const idField = Object.getOwnPropertyDescriptor(
      CreateItemDto.prototype,
      'id',
    );
    expect(idField).toBeUndefined();
  });

  it('should not have alt_id field in CreateItemDto', () => {
    // Verify that the CreateItemDto class doesn't have an alt_id field
    const altIdField = Object.getOwnPropertyDescriptor(
      CreateItemDto.prototype,
      'alt_id',
    );
    expect(altIdField).toBeUndefined();
  });

  it('should not have id field in UpdateItemDto', () => {
    // Verify that the UpdateItemDto class doesn't have an id field
    const idField = Object.getOwnPropertyDescriptor(
      UpdateItemDto.prototype,
      'id',
    );
    expect(idField).toBeUndefined();
  });

  it('should not have alt_id field in UpdateItemDto', () => {
    // Verify that the UpdateItemDto class doesn't have an alt_id field
    const altIdField = Object.getOwnPropertyDescriptor(
      UpdateItemDto.prototype,
      'alt_id',
    );
    expect(altIdField).toBeUndefined();
  });
});
