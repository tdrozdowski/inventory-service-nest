import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Invoice } from '../src/invoices/invoices.interface';

describe('InvoicesController (e2e)', () => {
  let app: INestApplication;
  let createdInvoiceId: number;

  // Test invoice data
  const testInvoice: Omit<Invoice, 'id' | 'alt_id'> = {
    total: 100.5,
    paid: false,
    user_id: 'test-user-123',
  };

  const updatedInvoice = {
    total: 150.75,
    paid: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('should create an invoice', () => {
    return request(app.getHttpServer())
      .post('/invoices')
      .send(testInvoice)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('alt_id');
        expect(res.body.total).toBe(testInvoice.total);
        expect(res.body.paid).toBe(testInvoice.paid);
        expect(res.body.user_id).toBe(testInvoice.user_id);

        // Save the created invoice ID for later tests
        createdInvoiceId = res.body.id;
      });
  });

  it('should get all invoices', () => {
    return request(app.getHttpServer())
      .get('/invoices')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('should get an invoice by ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices/${createdInvoiceId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdInvoiceId);
        expect(res.body.total).toBe(testInvoice.total);
        expect(res.body.paid).toBe(testInvoice.paid);
        expect(res.body.user_id).toBe(testInvoice.user_id);
      });
  });

  it('should get invoices by user ID', () => {
    return request(app.getHttpServer())
      .get(`/invoices/user/${testInvoice.user_id}`)
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
        expect(res.body[0].user_id).toBe(testInvoice.user_id);
      });
  });

  it('should update an invoice', () => {
    return request(app.getHttpServer())
      .put(`/invoices/${createdInvoiceId}`)
      .send(updatedInvoice)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdInvoiceId);
        expect(res.body.total).toBe(updatedInvoice.total);
        expect(res.body.paid).toBe(updatedInvoice.paid);
        expect(res.body.user_id).toBe(testInvoice.user_id); // user_id should remain unchanged
      });
  });

  it('should delete an invoice', () => {
    return request(app.getHttpServer())
      .delete(`/invoices/${createdInvoiceId}`)
      .expect(200);
  });

  it('should return 404 for a deleted invoice', () => {
    return request(app.getHttpServer())
      .get(`/invoices/${createdInvoiceId}`)
      .expect(404);
  });
});
