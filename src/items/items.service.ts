import { Injectable } from '@nestjs/common';
import { Item } from './items.interface';
import { ItemsRepository } from './items.repository';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  async findAll(): Promise<Item[]> {
    return this.itemsRepository.findAll();
  }

  async findOne(id: string): Promise<Item> {
    return this.itemsRepository.findOne(id);
  }

  async findByAltId(altId: string): Promise<Item> {
    return this.itemsRepository.findByAltId(altId);
  }

  async create(item: Omit<Item, 'id' | 'alt_id'>): Promise<Item> {
    return this.itemsRepository.create(item);
  }

  async update(id: string, item: Partial<Item>): Promise<Item> {
    return this.itemsRepository.update(id, item);
  }

  async remove(id: string): Promise<void> {
    await this.itemsRepository.remove(id);
  }
}
