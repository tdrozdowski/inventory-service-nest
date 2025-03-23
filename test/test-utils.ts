import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Item } from '../src/items/items.interface';
import { Person } from '../src/persons/persons.interface';
import { Invoice } from '../src/invoices/invoices.interface';

/**
 * Creates and initializes a NestJS application for testing
 */
export async function createTestingApp(): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = moduleFixture.createNestApplication();
  await app.init();

  return app;
}

/**
 * Creates a test item
 */
export async function createTestItem(
  app: INestApplication,
  itemData: Omit<Item, 'id' | 'alt_id'> = {
    name: 'Test Item',
    description: 'This is a test item',
    unit_price: 25.99,
  },
): Promise<Item> {
  const response = await request(app.getHttpServer())
    .post('/items')
    .send(itemData);

  return response.body;
}

/**
 * Creates a test person
 */
export async function createTestPerson(
  app: INestApplication,
  personData: Omit<Person, 'id' | 'alt_id'> = {
    name: 'Test Person',
    email: 'test.person@example.com',
  },
): Promise<Person> {
  const response = await request(app.getHttpServer())
    .post('/persons')
    .send(personData);

  return response.body;
}

/**
 * Creates a test invoice
 */
export async function createTestInvoice(
  app: INestApplication,
  invoiceData: Omit<Invoice, 'id' | 'alt_id'> = {
    total: 100.5,
    paid: false,
    user_id: 'test-user-123',
  },
): Promise<Invoice> {
  const response = await request(app.getHttpServer())
    .post('/invoices')
    .send(invoiceData);

  return response.body;
}

/**
 * Deletes a test item
 */
export async function deleteTestItem(
  app: INestApplication,
  itemId: string | number,
): Promise<void> {
  await request(app.getHttpServer()).delete(`/items/${itemId}`).expect(200);
}

/**
 * Deletes a test person
 */
export async function deleteTestPerson(
  app: INestApplication,
  personId: string | number,
): Promise<void> {
  await request(app.getHttpServer()).delete(`/persons/${personId}`).expect(200);
}

/**
 * Deletes a test invoice
 */
export async function deleteTestInvoice(
  app: INestApplication,
  invoiceId: string | number,
): Promise<void> {
  await request(app.getHttpServer())
    .delete(`/invoices/${invoiceId}`)
    .expect(200);
}

/**
 * Creates a test invoice-item relationship
 */
export async function createTestInvoiceItem(
  app: INestApplication,
  invoiceId: string | number,
  itemId: string | number,
): Promise<any> {
  const response = await request(app.getHttpServer())
    .post('/invoices-items')
    .send({
      invoice_id: invoiceId.toString(),
      item_id: itemId.toString(),
    });

  return response.body;
}

/**
 * Deletes a test invoice-item relationship
 */
export async function deleteTestInvoiceItem(
  app: INestApplication,
  invoiceId: string | number,
  itemId: string | number,
): Promise<void> {
  await request(app.getHttpServer())
    .delete(`/invoices-items/${invoiceId}/${itemId}`)
    .expect(200);
}
