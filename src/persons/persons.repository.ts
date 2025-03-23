import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nest-knexjs';
import { Person } from './persons.interface';

@Injectable()
export class PersonsRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {}

  async findAll(): Promise<Person[]> {
    return this.knex.table('persons').select('*');
  }

  async findOne(id: number): Promise<Person> {
    return this.knex.table('persons').where('id', id).first();
  }

  async findByAltId(altId: string): Promise<Person> {
    return this.knex.table('persons').where('alt_id', altId).first();
  }

  async findByEmail(email: string): Promise<Person> {
    return this.knex.table('persons').where('email', email).first();
  }

  async create(person: Omit<Person, 'id' | 'alt_id'>): Promise<Person> {
    const personToCreate = {
      ...person,
      created_by: person.created_by || 'system',
    };
    const [result] = await this.knex
      .table('persons')
      .insert(personToCreate)
      .returning('*');
    return result;
  }

  async update(id: number, person: Partial<Person>): Promise<Person> {
    const personToUpdate = {
      ...person,
      last_update: new Date(),
      last_changed_by: person.last_changed_by || 'system',
    };
    const [result] = await this.knex
      .table('persons')
      .where('id', id)
      .update(personToUpdate)
      .returning('*');
    return result;
  }

  async remove(id: number): Promise<void> {
    await this.knex.table('persons').where('id', id).delete();
  }
}
