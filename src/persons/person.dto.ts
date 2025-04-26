import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePersonDto {
  @ApiProperty({ description: 'The name of the person' })
  name: string;

  @ApiProperty({
    description: 'The email of the person',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({ description: 'Who created the person' })
  created_by?: string;
}

export class UpdatePersonDto {
  @ApiPropertyOptional({ description: 'The name of the person' })
  name?: string;

  @ApiPropertyOptional({
    description: 'The email of the person',
    example: 'john.doe@example.com',
  })
  email?: string;

  @ApiPropertyOptional({ description: 'Who last changed the person' })
  last_changed_by?: string;
}

export class PersonDto {
  @ApiPropertyOptional({ description: 'The unique identifier for the person' })
  id?: string;

  @ApiPropertyOptional({
    description: 'An alternative identifier for the person',
    readOnly: true,
  })
  alt_id?: string;

  @ApiProperty({ description: 'The name of the person' })
  name: string;

  @ApiProperty({
    description: 'The email of the person',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiPropertyOptional({ description: 'Who created the person' })
  created_by?: string;

  @ApiPropertyOptional({
    description: 'When the person was created',
    type: Date,
  })
  created_at?: Date;

  @ApiPropertyOptional({
    description: 'When the person was last updated',
    type: Date,
  })
  last_update?: Date;

  @ApiPropertyOptional({ description: 'Who last changed the person' })
  last_changed_by?: string;
}
