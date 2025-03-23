import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { InvoiceItem } from '../src/invoices-items/invoices-items.interface';
import { Invoice } from '../src/invoices/invoices.interface';
import { Item } from '../src/items/items.interface';

describe('InvoicesItemsController (e2e)', () => {
  let app: INestApplication;
  let createdInvoiceId: string;
  let createdItemId: string;

  // Test data for prerequisites
  const testInvoice: Omit<Invoice, 'id' | 'alt_id'> = {
    total: 200.0,
    paid: false,
    user_id: 'test-user-456',
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

    // Create a test invoice and item to use in the tests
    const invoiceResponse = await request(app.getHttpServer())
      .post('/invoices')
      .send(testInvoice);

    createdInvoiceId = invoiceResponse.body.id.toString();

    const itemResponse = await request(app.getHttpServer())
      .post('/items')
      .send(testItem);

    createdItemId = itemResponse.body.id.toString();
  });

  afterAll(async () => {
    // Clean up the test data
    await request(app.getHttpServer()).delete(`/items/${createdItemId}`);
    await request(app.getHttpServer()).delete(`/invoices/${createdInvoiceId}`);

    await app.close();
  });

  it('should create an invoice-item relationship', () => {
    const invoiceItem: InvoiceItem = {
      invoice_id: createdInvoiceId,
      item_id: createdItemId,
    };

    return request(app.getHttpServer())
      .post('/invoices-items')
      .send(invoiceItem)
      .expect(201)
      .expect((res) => {
        expect(res.body.invoice_id).toBe(createdInvoiceId);
        expect(res.body.item_id).toBe(createdItemId);
      });
  });

  it('should get all invoice-items', () => {
    return request(app.getHttpServer())
      .get('/invoices-items')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('should get invoice-items by invoice ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/invoice/${createdInvoiceId}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].invoice_id).toBe(createdInvoiceId);
      });
  });

  it('should get invoice-items by item ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/item/${createdItemId}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].item_id).toBe(createdItemId);
      });
  });

  it('should get a specific invoice-item by invoice ID and item ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/${createdInvoiceId}/${createdItemId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.invoice_id).toBe(createdInvoiceId);
        expect(res.body.item_id).toBe(createdItemId);
      });
  });

  it('should delete a specific invoice-item', () => {
    return request(app.getHttpServer())
      .delete(`/invoices-items/${createdInvoiceId}/${createdItemId}`)
      .expect(200);
  });

  it('should return 404 for a deleted invoice-item', () => {
    return request(app.getHttpServer())
      .get(`/invoices-items/${createdInvoiceId}/${createdItemId}`)
      .expect(404);
  });

  it('should create multiple invoice-items and delete by invoice ID', async () => {
    // Create a second test item
    const secondItemResponse = await request(app.getHttpServer())
      .post('/items')
      .send({
        name: 'Second Test Item',
        description: 'This is another test item',
        unit_price: 75.0,
      });

    const secondItemId = secondItemResponse.body.id.toString();

    // Create two invoice-items
    await request(app.getHttpServer())
      .post('/invoices-items')
      .send({
        invoice_id: createdInvoiceId,
        item_id: createdItemId,
      })
      .expect(201);

    await request(app.getHttpServer())
      .post('/invoices-items')
      .send({
        invoice_id: createdInvoiceId,
        item_id: secondItemId,
      })
      .expect(201);

    // Verify both exist
    const response = await request(app.getHttpServer())
      .get(`/invoices-items/invoice/${createdInvoiceId}`)
      .expect(200);

    expect(response.body.length).toBe(2);

    // Delete all invoice-items for the invoice
    await request(app.getHttpServer())
      .delete(`/invoices-items/invoice/${createdInvoiceId}`)
      .expect(200);

    // Verify they're gone
    await request(app.getHttpServer())
      .get(`/invoices-items/invoice/${createdInvoiceId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toBe(0);
      });

    // Clean up the second test item
    await request(app.getHttpServer()).delete(`/items/${secondItemId}`);
  });
});
