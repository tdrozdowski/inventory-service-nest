import { Injectable } from '@nestjs/common';
import { Person } from './persons.interface';
import { PersonsRepository } from './persons.repository';

@Injectable()
export class PersonsService {
  constructor(private readonly personsRepository: PersonsRepository) {}

  async findAll(): Promise<Person[]> {
    return this.personsRepository.findAll();
  }

  async findOne(id: string): Promise<Person> {
    return this.personsRepository.findOne(id);
  }

  async findByAltId(altId: string): Promise<Person> {
    return this.personsRepository.findByAltId(altId);
  }

  async findByEmail(email: string): Promise<Person> {
    return this.personsRepository.findByEmail(email);
  }

  async create(person: Omit<Person, 'id' | 'alt_id'>): Promise<Person> {
    return this.personsRepository.create(person);
  }

  async update(id: string, person: Partial<Person>): Promise<Person> {
    return this.personsRepository.update(id, person);
  }

  async remove(id: string): Promise<void> {
    await this.personsRepository.remove(id);
  }
}
