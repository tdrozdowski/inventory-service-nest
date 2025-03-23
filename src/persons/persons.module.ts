import { Module } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonsRepository } from './persons.repository';
import { PersonsController } from './persons.controller';

@Module({
  controllers: [PersonsController],
  providers: [PersonsService, PersonsRepository],
  exports: [PersonsService],
})
export class PersonsModule {}
