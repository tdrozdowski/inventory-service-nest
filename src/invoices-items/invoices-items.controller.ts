import { Body, Controller, Delete, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InvoicesItemsService } from './invoices-items.service';
import { InvoiceItemDto } from './invoice-item.dto';

@ApiTags('invoices-items')
@Controller('invoices-items')
export class InvoicesItemsController {
  constructor(private readonly invoicesItemsService: InvoicesItemsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all invoice items', description: 'Retrieves a list of all invoice items in the system' })
  @ApiResponse({ status: 200, description: 'List of invoice items retrieved successfully', type: [InvoiceItemDto] })
  async findAll(): Promise<InvoiceItemDto[]> {
    return this.invoicesItemsService.findAll();
  }

  @Get('invoice/:invoiceId')
  @ApiOperation({ summary: 'Get invoice items by invoice ID', description: 'Retrieves all items associated with a specific invoice' })
  @ApiParam({ name: 'invoiceId', description: 'ID of the invoice' })
  @ApiResponse({ status: 200, description: 'List of invoice items retrieved successfully', type: [InvoiceItemDto] })
  async findByInvoiceId(
    @Param('invoiceId') invoiceId: string,
  ): Promise<InvoiceItemDto[]> {
    return this.invoicesItemsService.findByInvoiceId(invoiceId);
  }

  @Get('item/:itemId')
  @ApiOperation({ summary: 'Get invoice items by item ID', description: 'Retrieves all invoices associated with a specific item' })
  @ApiParam({ name: 'itemId', description: 'ID of the item' })
  @ApiResponse({ status: 200, description: 'List of invoice items retrieved successfully', type: [InvoiceItemDto] })
  async findByItemId(@Param('itemId') itemId: string): Promise<InvoiceItemDto[]> {
    return this.invoicesItemsService.findByItemId(itemId);
  }

  @Get(':invoiceId/:itemId')
  @ApiOperation({ summary: 'Get specific invoice item', description: 'Retrieves a specific invoice item by invoice ID and item ID' })
  @ApiParam({ name: 'invoiceId', description: 'ID of the invoice' })
  @ApiParam({ name: 'itemId', description: 'ID of the item' })
  @ApiResponse({ status: 200, description: 'Invoice item retrieved successfully', type: InvoiceItemDto })
  @ApiResponse({ status: 404, description: 'Invoice item not found' })
  async findOne(
    @Param('invoiceId') invoiceId: string,
    @Param('itemId') itemId: string,
  ): Promise<InvoiceItemDto> {
    const invoiceItem = await this.invoicesItemsService.findOne(invoiceId, itemId);
    if (!invoiceItem) {
      throw new NotFoundException(`Invoice item with invoice_id ${invoiceId} and item_id ${itemId} not found`);
    }
    return invoiceItem;
  }

  @Post()
  @ApiOperation({ summary: 'Create invoice item', description: 'Creates a new association between an invoice and an item' })
  @ApiResponse({ status: 201, description: 'Invoice item created successfully', type: InvoiceItemDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(@Body() createInvoiceItemDto: InvoiceItemDto): Promise<InvoiceItemDto> {
    return this.invoicesItemsService.create(createInvoiceItemDto);
  }

  @Delete('invoice/:invoiceId')
  @ApiOperation({ summary: 'Delete invoice items by invoice ID', description: 'Deletes all items associated with a specific invoice' })
  @ApiParam({ name: 'invoiceId', description: 'ID of the invoice' })
  @ApiResponse({ status: 200, description: 'Invoice items deleted successfully' })
  removeByInvoiceId(@Param('invoiceId') invoiceId: string): Promise<void> {
    return this.invoicesItemsService.removeByInvoiceId(invoiceId);
  }

  @Delete('item/:itemId')
  @ApiOperation({ summary: 'Delete invoice items by item ID', description: 'Deletes all invoices associated with a specific item' })
  @ApiParam({ name: 'itemId', description: 'ID of the item' })
  @ApiResponse({ status: 200, description: 'Invoice items deleted successfully' })
  removeByItemId(@Param('itemId') itemId: string): Promise<void> {
    return this.invoicesItemsService.removeByItemId(itemId);
  }

  @Delete(':invoiceId/:itemId')
  @ApiOperation({ summary: 'Delete specific invoice item', description: 'Deletes a specific association between an invoice and an item' })
  @ApiParam({ name: 'invoiceId', description: 'ID of the invoice' })
  @ApiParam({ name: 'itemId', description: 'ID of the item' })
  @ApiResponse({ status: 200, description: 'Invoice item deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice item not found' })
  remove(
    @Param('invoiceId') invoiceId: string,
    @Param('itemId') itemId: string,
  ): Promise<void> {
    return this.invoicesItemsService.remove(invoiceId, itemId);
  }
}
