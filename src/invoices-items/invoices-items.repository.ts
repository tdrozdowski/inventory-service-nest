import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { InvoiceItem } from './invoices-items.interface';

@Injectable()
export class InvoicesItemsRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(): Promise<InvoiceItem[]> {
    return this.knex.table('invoices_items').select('*');
  }

  async findByInvoiceId(invoiceId: string): Promise<InvoiceItem[]> {
    return this.knex.table('invoices_items').where('invoice_id', invoiceId);
  }

  async findByItemId(itemId: string): Promise<InvoiceItem[]> {
    return this.knex.table('invoices_items').where('item_id', itemId);
  }

  async findOne(invoiceId: string, itemId: string): Promise<InvoiceItem> {
    return this.knex
      .table('invoices_items')
      .where({ invoice_id: invoiceId, item_id: itemId })
      .first();
  }

  async create(invoiceItem: InvoiceItem): Promise<InvoiceItem> {
    const [result] = await this.knex
      .table('invoices_items')
      .insert(invoiceItem)
      .returning('*');
    return result;
  }

  async remove(invoiceId: string, itemId: string): Promise<void> {
    await this.knex
      .table('invoices_items')
      .where({ invoice_id: invoiceId, item_id: itemId })
      .delete();
  }

  async removeByInvoiceId(invoiceId: string): Promise<void> {
    await this.knex
      .table('invoices_items')
      .where('invoice_id', invoiceId)
      .delete();
  }

  async removeByItemId(itemId: string): Promise<void> {
    await this.knex.table('invoices_items').where('item_id', itemId).delete();
  }
}
