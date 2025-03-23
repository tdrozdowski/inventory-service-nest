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
 * Creates a test invoice with a valid user_id
 */
export async function createTestInvoice(
  app: INestApplication,
  invoiceData?: Partial<Omit<Invoice, 'id' | 'alt_id'>>,
): Promise<Invoice> {
  // Create a test person first to get a valid UUID for user_id
  const personData = {
    name: 'Test Person for Invoice',
    email: `test.invoice.person.${Date.now()}@example.com`,
  };

  const personResponse = await request(app.getHttpServer())
    .post('/persons')
    .send(personData);

  const personAltId = personResponse.body.alt_id;

  // Create the invoice with the person's alt_id as user_id
  const defaultInvoiceData = {
    total: 100.5,
    paid: false,
    user_id: personAltId,
  };

  const finalInvoiceData = { ...defaultInvoiceData, ...invoiceData, user_id: personAltId };

  const response = await request(app.getHttpServer())
    .post('/invoices')
    .send(finalInvoiceData);

  // Store the person's id in the invoice object for later cleanup
  response.body._testPersonId = personResponse.body.id;

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
 * Deletes a test invoice and its associated person
 */
export async function deleteTestInvoice(
  app: INestApplication,
  invoiceId: string | number,
  personId?: string | number,
): Promise<void> {
  try {
    // Delete the invoice
    await request(app.getHttpServer())
      .delete(`/invoices/${invoiceId}`)
      .expect(200);

    // If personId is provided, delete the person too
    if (personId) {
      await request(app.getHttpServer())
        .delete(`/persons/${personId}`)
        .expect(200);
    }
  } catch (error) {
    console.error('Error deleting test invoice or person:', error);
  }
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
