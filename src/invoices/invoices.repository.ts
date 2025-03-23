import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nest-knexjs';
import { Invoice } from './invoices.interface';

@Injectable()
export class InvoicesRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findAll(): Promise<Invoice[]> {
    return this.knex.table('invoices').select('*');
  }

  async findOne(id: number): Promise<Invoice> {
    return this.knex.table('invoices').where('id', id).first();
  }

  async findByAltId(altId: string): Promise<Invoice> {
    return this.knex.table('invoices').where('alt_id', altId).first();
  }

  async findByUserId(userId: string): Promise<Invoice[]> {
    return this.knex.table('invoices').where('user_id', userId);
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
    return result;
  }

  async remove(id: number): Promise<void> {
    await this.knex.table('invoices').where('id', id).delete();
  }
}
