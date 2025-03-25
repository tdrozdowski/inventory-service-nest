import { Injectable } from '@nestjs/common';
import { InjectConnection } from 'nest-knexjs';
import { Knex } from 'knex';
import { Item } from './items.interface';

@Injectable()
export class ItemsRepository {
  constructor(@InjectConnection() private readonly knex: Knex) {}

  async findAll(): Promise<Item[]> {
    const items = await this.knex.table('items').select('*');
    return items.map((item) => ({
      ...item,
      unit_price: Number(item.unit_price),
    }));
  }

  async findOne(id: number): Promise<Item> {
    const item = await this.knex.table('items').where('id', id).first();
    if (item) {
      item.unit_price = Number(item.unit_price);
    }
    return item;
  }

  async findByAltId(altId: string): Promise<Item> {
    const item = await this.knex.table('items').where('alt_id', altId).first();
    if (item) {
      item.unit_price = Number(item.unit_price);
    }
    return item;
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

    if (result) {
      result.unit_price = Number(result.unit_price);
    }

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

    if (result) {
      result.unit_price = Number(result.unit_price);
    }

    return result;
  }

  async remove(id: number): Promise<void> {
    await this.knex.table('items').where('id', id).delete();
  }
}
