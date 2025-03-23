import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { PersonsService } from './persons.service';
import { Person } from './persons.interface';

@Controller('persons')
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get()
  findAll(): Promise<Person[]> {
    return this.personsService.findAll();
  }

  @Get('alt/:altId')
  async findByAltId(@Param('altId') altId: string): Promise<Person> {
    const person = await this.personsService.findByAltId(altId);
    if (!person) {
      throw new NotFoundException(`Person with alt_id ${altId} not found`);
    }
    return person;
  }

  @Get('email/:email')
  async findByEmail(@Param('email') email: string): Promise<Person> {
    const person = await this.personsService.findByEmail(email);
    if (!person) {
      throw new NotFoundException(`Person with email ${email} not found`);
    }
    return person;
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Person> {
    const person = await this.personsService.findOne(+id);
    if (!person) {
      throw new NotFoundException(`Person with ID ${id} not found`);
    }
    return person;
  }

  @Post()
  create(
    @Body() createPersonDto: Omit<Person, 'id' | 'alt_id'>,
  ): Promise<Person> {
    return this.personsService.create(createPersonDto);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePersonDto: Partial<Person>,
  ): Promise<Person> {
    return this.personsService.update(+id, updatePersonDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.personsService.remove(+id);
  }
}
