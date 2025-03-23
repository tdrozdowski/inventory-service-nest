import {
  Body,
  Controller,
  Delete,
  Get,
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
  findByAltId(@Param('altId') altId: string): Promise<Person> {
    return this.personsService.findByAltId(altId);
  }

  @Get('email/:email')
  findByEmail(@Param('email') email: string): Promise<Person> {
    return this.personsService.findByEmail(email);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Person> {
    return this.personsService.findOne(+id);
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
