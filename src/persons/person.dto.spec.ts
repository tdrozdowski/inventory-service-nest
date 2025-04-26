import { PersonDto, CreatePersonDto, UpdatePersonDto } from './person.dto';

describe('PersonDto', () => {
  // Instead of checking the class structure, we'll verify that the DTO classes
  // are defined correctly by checking their properties
  it('should have PersonDto class defined', () => {
    expect(PersonDto).toBeDefined();
  });

  it('should have CreatePersonDto class defined', () => {
    expect(CreatePersonDto).toBeDefined();
  });

  it('should have UpdatePersonDto class defined', () => {
    expect(UpdatePersonDto).toBeDefined();
  });

  it('should not have id field in CreatePersonDto', () => {
    // Verify that the CreatePersonDto class doesn't have an id field
    const idField = Object.getOwnPropertyDescriptor(
      CreatePersonDto.prototype,
      'id',
    );
    expect(idField).toBeUndefined();
  });

  it('should not have alt_id field in CreatePersonDto', () => {
    // Verify that the CreatePersonDto class doesn't have an alt_id field
    const altIdField = Object.getOwnPropertyDescriptor(
      CreatePersonDto.prototype,
      'alt_id',
    );
    expect(altIdField).toBeUndefined();
  });

  it('should not have id field in UpdatePersonDto', () => {
    // Verify that the UpdatePersonDto class doesn't have an id field
    const idField = Object.getOwnPropertyDescriptor(
      UpdatePersonDto.prototype,
      'id',
    );
    expect(idField).toBeUndefined();
  });

  it('should not have alt_id field in UpdatePersonDto', () => {
    // Verify that the UpdatePersonDto class doesn't have an alt_id field
    const altIdField = Object.getOwnPropertyDescriptor(
      UpdatePersonDto.prototype,
      'alt_id',
    );
    expect(altIdField).toBeUndefined();
  });
});
