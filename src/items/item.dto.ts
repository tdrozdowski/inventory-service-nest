import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateItemDto {
  @ApiProperty({ description: 'The name of the item' })
  name: string;

  @ApiProperty({ description: 'A description of the item' })
  description: string;

  @ApiProperty({ description: 'The price per unit', example: 10.99 })
  unit_price: number;

  @ApiPropertyOptional({ description: 'Who created the item' })
  created_by?: string;
}

export class UpdateItemDto {
  @ApiPropertyOptional({ description: 'The name of the item' })
  name?: string;

  @ApiPropertyOptional({ description: 'A description of the item' })
  description?: string;

  @ApiPropertyOptional({ description: 'The price per unit', example: 10.99 })
  unit_price?: number;

  @ApiPropertyOptional({ description: 'Who last changed the item' })
  last_changed_by?: string;
}

export class ItemDto {
  @ApiPropertyOptional({ description: 'The unique identifier for the item' })
  id?: number;

  @ApiPropertyOptional({ description: 'An alternative identifier for the item' })
  alt_id?: string;

  @ApiProperty({ description: 'The name of the item' })
  name: string;

  @ApiProperty({ description: 'A description of the item' })
  description: string;

  @ApiProperty({ description: 'The price per unit', example: 10.99 })
  unit_price: number;

  @ApiPropertyOptional({ description: 'Who created the item' })
  created_by?: string;

  @ApiPropertyOptional({ description: 'When the item was created', type: Date })
  created_at?: Date;

  @ApiPropertyOptional({ description: 'When the item was last updated', type: Date })
  last_update?: Date;

  @ApiPropertyOptional({ description: 'Who last changed the item' })
  last_changed_by?: string;
}
