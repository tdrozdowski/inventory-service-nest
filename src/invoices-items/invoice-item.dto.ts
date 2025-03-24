import { ApiProperty } from '@nestjs/swagger';

export class InvoiceItemDto {
  @ApiProperty({ description: 'The ID of the invoice' })
  invoice_id: string;

  @ApiProperty({ description: 'The ID of the item' })
  item_id: string;
}
