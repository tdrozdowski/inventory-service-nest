import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { InvoiceItem } from '../src/invoices-items/invoices-items.interface';
import { Invoice } from '../src/invoices/invoices.interface';
import { Item } from '../src/items/items.interface';
import { Person } from '../src/persons/persons.interface';
import { getAuthToken } from './auth-helper';

describe('InvoicesItemsController (e2e)', () => {
  let app: INestApplication;
  let createdInvoiceAltId: string;
  let createdItemAltId: string;
  let createdInvoiceId: string;
  let createdItemId: string;
  let createdPersonId: string;
  let personAltId: string;
  let authToken: string;

  // Test person data
  const testPerson: Omit<Person, 'id' | 'alt_id'> = {
    name: 'Test Person for Invoice Items',
    email: 'test.invoice.items.person@example.com',
  };

  // Test data for prerequisites
  const testInvoice: Omit<Invoice, 'id' | 'alt_id'> = {
    total: 200.0,
    paid: false,
    user_id: '', // Will be set after creating a person
  };

  const testItem: Omit<Item, 'id' | 'alt_id'> = {
    name: 'Test Item for Invoice',
    description: 'This is a test item for invoice-items test',
    unit_price: 50.0,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    // Get authentication token
    authToken = await getAuthToken(app);
    console.log('Auth token obtained for tests');

    // Create a test person first
    const personResponse = await request(app.getHttpServer())
      .post('/persons')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testPerson);

    createdPersonId = personResponse.body.id;
    personAltId = personResponse.body.alt_id;

    // Set the user_id for the test invoice
    testInvoice.user_id = personAltId;

    // Create a test invoice and item to use in the tests
    const invoiceResponse = await request(app.getHttpServer())
      .post('/invoices')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testInvoice);

    createdInvoiceId = invoiceResponse.body.id; // Store numeric ID for deletion
    createdInvoiceAltId = invoiceResponse.body.alt_id; // Store alt_id for relationships

    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send(testItem);

    createdItemId = itemResponse.body.id; // Store numeric ID for deletion
    createdItemAltId = itemResponse.body.alt_id; // Store alt_id for relationships
  });

  afterAll(async () => {
    // Clean up the test data
    try {
      // Delete the item using its numeric ID
      if (createdItemId) {
        await request(app.getHttpServer())
          .delete(`/items/${createdItemId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      }

      // Delete the invoice using its numeric ID
      if (createdInvoiceId) {
        await request(app.getHttpServer())
          .delete(`/invoices/${createdInvoiceId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      }

      // Clean up the test person after all tests
      if (createdPersonId) {
        await request(app.getHttpServer())
          .delete(`/persons/${createdPersonId}`)
          .set('Authorization', `Bearer ${authToken}`)
          .expect(200);
      }
    } catch (error) {
      console.error('Error during cleanup:', error);
    }

    await app.close();
  });

  it('should create an invoice-item relationship', () => {
    const invoiceItem: InvoiceItem = {
      invoice_id: createdInvoiceAltId,
      item_id: createdItemAltId,
    };

    return request(app.getHttpServer())
      .post('/invoices-items')
      .set('Authorization', `Bearer ${authToken}`)
      .send(invoiceItem)
      .expect(201)
      .expect((res) => {
        expect(res.body.invoice_id).toBe(createdInvoiceAltId);
        expect(res.body.item_id).toBe(createdItemAltId);
      });
  });

  it('should get all invoice-items', () => {
    return request(app.getHttpServer())
      .get('/invoices-items')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('should get invoice-items by invoice ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/invoice/${createdInvoiceAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].invoice_id).toBe(createdInvoiceAltId);
      });
  });

  it('should get invoice-items by item ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/item/${createdItemAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].item_id).toBe(createdItemAltId);
      });
  });

  it('should get a specific invoice-item by invoice ID and item ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/${createdInvoiceAltId}/${createdItemAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.invoice_id).toBe(createdInvoiceAltId);
        expect(res.body.item_id).toBe(createdItemAltId);
      });
  });

  it('should delete a specific invoice-item', () => {
    return request(app.getHttpServer())
      .delete(`/invoices-items/${createdInvoiceAltId}/${createdItemAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);
  });

  it('should return 404 for a deleted invoice-item', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/${createdInvoiceAltId}/${createdItemAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(404);
  });

  it('should create multiple invoice-items and delete by invoice ID', async () => {
    // Create a second test item
    const secondItemResponse = await request(app.getHttpServer())
      .post('/items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Second Test Item',
        description: 'This is another test item',
        unit_price: 75.0,
      });

    const secondItemId = secondItemResponse.body.id; // Numeric ID for deletion
    const secondItemAltId = secondItemResponse.body.alt_id; // Alt ID for relationships

    // Create two invoice-items
    await request(app.getHttpServer())
      .post('/invoices-items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        invoice_id: createdInvoiceAltId,
        item_id: createdItemAltId,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/invoices-items')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        invoice_id: createdInvoiceAltId,
        item_id: secondItemAltId,
      })
      .expect(201);

    // Verify both exist
    const response = await request(app.getHttpServer())
      .get(`/invoices-items/invoice/${createdInvoiceAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(response.body.length).toBe(2);

    // Delete all invoice-items for the invoice
    await request(app.getHttpServer())
      .delete(`/invoices-items/invoice/${createdInvoiceAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    // Verify they're gone
    await request(app.getHttpServer())
      .get(`/invoices-items/invoice/${createdInvoiceAltId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(0);
      });

    // Clean up the second test item using its numeric ID
    await request(app.getHttpServer())
      .delete(`/items/${secondItemId}`)
      .set('Authorization', `Bearer ${authToken}`);
  });
});
