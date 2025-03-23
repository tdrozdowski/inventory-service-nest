import {
  Body,
  Controller,
  Delete,
  Get,
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
  findByAltId(@Param('altId') altId: string): Promise<Invoice> {
    return this.invoicesService.findByAltId(altId);
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Invoice[]> {
    return this.invoicesService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Invoice> {
    return this.invoicesService.findOne(+id);
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
