import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInvoiceDto {
  @ApiProperty({
    description: 'The total amount of the invoice',
    example: 100.5,
  })
  total: number;

  @ApiPropertyOptional({
    description: 'Whether the invoice has been paid',
    default: false,
  })
  paid?: boolean;

  @ApiProperty({
    description: 'The ID of the user associated with the invoice',
  })
  user_id: string;

  @ApiPropertyOptional({ description: 'Who created the invoice' })
  created_by?: string;
}

export class UpdateInvoiceDto {
  @ApiPropertyOptional({
    description: 'The total amount of the invoice',
    example: 100.5,
  })
  total?: number;

  @ApiPropertyOptional({ description: 'Whether the invoice has been paid' })
  paid?: boolean;

  @ApiPropertyOptional({
    description: 'The ID of the user associated with the invoice',
  })
  user_id?: string;

  @ApiPropertyOptional({ description: 'Who last changed the invoice' })
  last_changed_by?: string;
}

export class InvoiceDto {
  @ApiPropertyOptional({ description: 'The unique identifier for the invoice' })
  id?: number;

  @ApiPropertyOptional({
    description: 'An alternative identifier for the invoice',
  })
  alt_id?: string;

  @ApiProperty({
    description: 'The total amount of the invoice',
    example: 100.5,
  })
  total: number;

  @ApiPropertyOptional({
    description: 'Whether the invoice has been paid',
    default: false,
  })
  paid?: boolean;

  @ApiProperty({
    description: 'The ID of the user associated with the invoice',
  })
  user_id: string;

  @ApiPropertyOptional({ description: 'Who created the invoice' })
  created_by?: string;

  @ApiPropertyOptional({
    description: 'When the invoice was created',
    type: Date,
  })
  created_at?: Date;

  @ApiPropertyOptional({
    description: 'When the invoice was last updated',
    type: Date,
  })
  last_update?: Date;

  @ApiPropertyOptional({ description: 'Who last changed the invoice' })
  last_changed_by?: string;
}
