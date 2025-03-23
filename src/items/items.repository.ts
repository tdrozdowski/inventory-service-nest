import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nest-knexjs';
import { Item } from './items.interface';

@Injectable()
export class ItemsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findAll(): Promise<Item[]> {
    return this.knex.table('items').select('*');
  }

  async findOne(id: number): Promise<Item> {
    return this.knex.table('items').where('id', id).first();
  }

  async findByAltId(altId: string): Promise<Item> {
    return this.knex.table('items').where('alt_id', altId).first();
  }

  async create(item: Omit<Item, 'id' | 'alt_id'>): Promise<Item> {
    const itemToCreate = {
      ...item,
      created_by: item.created_by || 'system',
    };
    const [result] = await this.knex
      .table('items')
      .insert(itemToCreate)
      .returning('*');
    return result;
  }

  async update(id: number, item: Partial<Item>): Promise<Item> {
    const itemToUpdate = {
      ...item,
      last_update: new Date(),
      last_changed_by: item.last_changed_by || 'system',
    };
    const [result] = await this.knex
      .table('items')
      .where('id', id)
      .update(itemToUpdate)
      .returning('*');
    return result;
  }

  async remove(id: number): Promise<void> {
    await this.knex.table('items').where('id', id).delete();
  }
}
