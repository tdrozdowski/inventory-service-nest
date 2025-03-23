import { Module } from '@nestjs/common';
import { InvoicesItemsController } from './invoices-items.controller';
import { InvoicesItemsService } from './invoices-items.service';
import { InvoicesItemsRepository } from './invoices-items.repository';

@Module({
  controllers: [InvoicesItemsController],
  providers: [InvoicesItemsService, InvoicesItemsRepository],
  exports: [InvoicesItemsService],
})
export class InvoicesItemsModule {}
