import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { Invoice } from './invoices.interface';

@Injectable()
export class InvoicesRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(): Promise<Invoice[]> {
    const invoices = await this.knex.table('invoices').select('*');
    return invoices.map(invoice => ({
      ...invoice,
      total: Number(invoice.total)
    }));
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.knex.table('invoices').where('id', id).first();
    if (invoice) {
      invoice.total = Number(invoice.total);
    }
    return invoice;
  }

  async findByAltId(altId: string): Promise<Invoice> {
    const invoice = await this.knex.table('invoices').where('alt_id', altId).first();
    if (invoice) {
      invoice.total = Number(invoice.total);
    }
    return invoice;
  }

  async findByUserId(userId: string): Promise<Invoice[]> {
    const invoices = await this.knex.table('invoices').where('user_id', userId);
    return invoices.map(invoice => ({
      ...invoice,
      total: Number(invoice.total)
    }));
  }

  async create(invoice: Omit<Invoice, 'id' | 'alt_id'>): Promise<Invoice> {
    const invoiceToCreate = {
      ...invoice,
      created_by: invoice.created_by || 'system',
    };
    const [result] = await this.knex
      .table('invoices')
      .insert(invoiceToCreate)
      .returning('*');

    if (result) {
      result.total = Number(result.total);
    }

    return result;
  }

  async update(id: number, invoice: Partial<Invoice>): Promise<Invoice> {
    const invoiceToUpdate = {
      ...invoice,
      last_update: new Date(),
      last_changed_by: invoice.last_changed_by || 'system',
    };
    const [result] = await this.knex
      .table('invoices')
      .where('id', id)
      .update(invoiceToUpdate)
      .returning('*');

    if (result) {
      result.total = Number(result.total);
    }

    return result;
  }

  async remove(id: number): Promise<void> {
    await this.knex.table('invoices').where('id', id).delete();
  }
}
