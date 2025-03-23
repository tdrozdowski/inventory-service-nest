import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoices.interface';
import { CreateInvoiceDto, UpdateInvoiceDto, InvoiceDto } from './invoice.dto';

@ApiTags('invoices')
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all invoices', description: 'Retrieves a list of all invoices in the system' })
  @ApiResponse({ status: 200, description: 'List of invoices retrieved successfully', type: [InvoiceDto] })
  async findAll(): Promise<InvoiceDto[]> {
    return this.invoicesService.findAll();
  }

  @Get('alt/:altId')
  @ApiOperation({ summary: 'Get invoice by alternative ID', description: 'Retrieves an invoice by its alternative ID' })
  @ApiParam({ name: 'altId', description: 'Alternative ID of the invoice' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully', type: InvoiceDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findByAltId(@Param('altId') altId: string): Promise<InvoiceDto> {
    const invoice = await this.invoicesService.findByAltId(altId);
    if (!invoice) {
      throw new NotFoundException(`Invoice with alt_id ${altId} not found`);
    }
    return invoice;
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get invoices by user ID', description: 'Retrieves all invoices associated with a specific user' })
  @ApiParam({ name: 'userId', description: 'ID of the user' })
  @ApiResponse({ status: 200, description: 'List of invoices retrieved successfully', type: [InvoiceDto] })
  async findByUserId(@Param('userId') userId: string): Promise<InvoiceDto[]> {
    return this.invoicesService.findByUserId(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get invoice by ID', description: 'Retrieves an invoice by its ID' })
  @ApiParam({ name: 'id', description: 'ID of the invoice' })
  @ApiResponse({ status: 200, description: 'Invoice retrieved successfully', type: InvoiceDto })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  async findOne(@Param('id') id: string): Promise<InvoiceDto> {
    const invoice = await this.invoicesService.findOne(+id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  @Post()
  @ApiOperation({ summary: 'Create invoice', description: 'Creates a new invoice in the system' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully', type: InvoiceDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  create(
    @Body() createInvoiceDto: CreateInvoiceDto,
  ): Promise<InvoiceDto> {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update invoice', description: 'Updates an existing invoice in the system' })
  @ApiParam({ name: 'id', description: 'ID of the invoice to update' })
  @ApiResponse({ status: 200, description: 'Invoice updated successfully', type: InvoiceDto })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: UpdateInvoiceDto,
  ): Promise<InvoiceDto> {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete invoice', description: 'Deletes an invoice from the system' })
  @ApiParam({ name: 'id', description: 'ID of the invoice to delete' })
  @ApiResponse({ status: 200, description: 'Invoice deleted successfully' })
  @ApiResponse({ status: 404, description: 'Invoice not found' })
  remove(@Param('id') id: string): Promise<void> {
    return this.invoicesService.remove(+id);
  }
}
