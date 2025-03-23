import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { InvoicesItemsService } from './invoices-items.service';
import { InvoiceItem } from './invoices-items.interface';

@Controller('invoices-items')
export class InvoicesItemsController {
  constructor(private readonly invoicesItemsService: InvoicesItemsService) {}

  @Get()
  findAll(): Promise<InvoiceItem[]> {
    return this.invoicesItemsService.findAll();
  }

  @Get('invoice/:invoiceId')
  findByInvoiceId(
    @Param('invoiceId') invoiceId: string,
  ): Promise<InvoiceItem[]> {
    return this.invoicesItemsService.findByInvoiceId(invoiceId);
  }

  @Get('item/:itemId')
  findByItemId(@Param('itemId') itemId: string): Promise<InvoiceItem[]> {
    return this.invoicesItemsService.findByItemId(itemId);
  }

  @Get(':invoiceId/:itemId')
  findOne(
    @Param('invoiceId') invoiceId: string,
    @Param('itemId') itemId: string,
  ): Promise<InvoiceItem> {
    return this.invoicesItemsService.findOne(invoiceId, itemId);
  }

  @Post()
  create(@Body() createInvoiceItemDto: InvoiceItem): Promise<InvoiceItem> {
    return this.invoicesItemsService.create(createInvoiceItemDto);
  }

  @Delete(':invoiceId/:itemId')
  remove(
    @Param('invoiceId') invoiceId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.invoicesItemsService.remove(invoiceId, itemId);
  }

  @Delete('invoice/:invoiceId')
  removeByInvoiceId(@Param('invoiceId') invoiceId: string): Promise<void> {
    return this.invoicesItemsService.removeByInvoiceId(invoiceId);
  }

  @Delete('item/:itemId')
  removeByItemId(@Param('itemId') itemId: string): Promise<void> {
    return this.invoicesItemsService.removeByItemId(itemId);
  }
}
