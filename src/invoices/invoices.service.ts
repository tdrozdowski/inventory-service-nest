import { Injectable } from '@nestjs/common';
import { Invoice } from './invoices.interface';
import { InvoicesRepository } from './invoices.repository';

@Injectable()
export class InvoicesService {
  constructor(private readonly invoicesRepository: InvoicesRepository) {}

  async findAll(): Promise<Invoice[]> {
    return this.invoicesRepository.findAll();
  }

  async findOne(id: number): Promise<Invoice> {
    return this.invoicesRepository.findOne(id);
  }

  async findByAltId(altId: string): Promise<Invoice> {
    return this.invoicesRepository.findByAltId(altId);
  }

  async findByUserId(userId: string): Promise<Invoice[]> {
    return this.invoicesRepository.findByUserId(userId);
  }

  async create(invoice: Omit<Invoice, 'id' | 'alt_id'>): Promise<Invoice> {
    return this.invoicesRepository.create(invoice);
  }

  async update(id: number, invoice: Partial<Invoice>): Promise<Invoice> {
    return this.invoicesRepository.update(id, invoice);
  }

  async remove(id: number): Promise<void> {
    await this.invoicesRepository.remove(id);
  }
}
