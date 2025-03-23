import { Injectable } from '@nestjs/common';
import { InvoiceItem } from './invoices-items.interface';
import { InvoicesItemsRepository } from './invoices-items.repository';

@Injectable()
export class InvoicesItemsService {
  constructor(
    private readonly invoicesItemsRepository: InvoicesItemsRepository,
  ) {}

  async findAll(): Promise<InvoiceItem[]> {
    return this.invoicesItemsRepository.findAll();
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    return this.invoicesItemsRepository.findByInvoiceId(invoiceId);
  }

  async findByItemId(itemId: string): Promise<InvoiceItem[]> {
    return this.invoicesItemsRepository.findByItemId(itemId);
  }

  async findOne(invoiceId: string, itemId: string): Promise<InvoiceItem> {
    return this.invoicesItemsRepository.findOne(invoiceId, itemId);
  }

  async create(invoiceItem: InvoiceItem): Promise<InvoiceItem> {
    return this.invoicesItemsRepository.create(invoiceItem);
  }

  async remove(invoiceId: string, itemId: string): Promise<void> {
    await this.invoicesItemsRepository.remove(invoiceId, itemId);
  }

  async removeByInvoiceId(invoiceId: string): Promise<void> {
    await this.invoicesItemsRepository.removeByInvoiceId(invoiceId);
  }

  async removeByItemId(itemId: string): Promise<void> {
    await this.invoicesItemsRepository.removeByItemId(itemId);
  }
}
