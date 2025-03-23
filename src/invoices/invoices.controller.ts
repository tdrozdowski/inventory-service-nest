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
import { InvoicesService } from './invoices.service';
import { Invoice } from './invoices.interface';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  findAll(): Promise<Invoice[]> {
    return this.invoicesService.findAll();
  }

  @Get('alt/:altId')
  async findByAltId(@Param('altId') altId: string): Promise<Invoice> {
    const invoice = await this.invoicesService.findByAltId(altId);
    if (!invoice) {
      throw new NotFoundException(`Invoice with alt_id ${altId} not found`);
    }
    return invoice;
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Invoice[]> {
    return this.invoicesService.findByUserId(userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Invoice> {
    const invoice = await this.invoicesService.findOne(+id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }
    return invoice;
  }

  @Post()
  create(
    @Body() createInvoiceDto: Omit<Invoice, 'id' | 'alt_id'>,
  ): Promise<Invoice> {
    return this.invoicesService.create(createInvoiceDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateInvoiceDto: Partial<Invoice>,
  ): Promise<Invoice> {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.invoicesService.remove(+id);
  }
}
