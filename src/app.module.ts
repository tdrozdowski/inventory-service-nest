import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KnexModule } from 'nest-knexjs';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ItemsModule } from './items/items.module';
import { ItemsController } from './items/items.controller';
import { PersonsModule } from './persons/persons.module';
import { PersonsController } from './persons/persons.controller';
import { InvoicesModule } from './invoices/invoices.module';
import { InvoicesController } from './invoices/invoices.controller';
import { InvoicesItemsModule } from './invoices-items/invoices-items.module';
import { InvoicesItemsController } from './invoices-items/invoices-items.controller';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig],
    }),
    KnexModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        config: configService.get('database.config'),
      }),
    }),
    ItemsModule,
    PersonsModule,
    InvoicesModule,
    InvoicesItemsModule,
  ],
  controllers: [
    AppController,
    ItemsController,
    PersonsController,
    InvoicesController,
    InvoicesItemsController,
  ],
  providers: [AppService],
})
export class AppModule {}
