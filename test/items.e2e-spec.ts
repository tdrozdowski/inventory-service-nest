import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Item } from '../src/items/items.interface';

describe('ItemsController (e2e)', () => {
  let app: INestApplication;
  let createdItemId: number;

  // Test item data
  const testItem: Omit<Item, 'id' | 'alt_id'> = {
    name: 'Test Item',
    description: 'This is a test item created by e2e test',
    unit_price: 25.99,
  };

  const updatedItem = {
    name: 'Updated Test Item',
    description: 'This item was updated by e2e test',
    unit_price: 29.99,
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

  it('should create an item', () => {
    return request(app.getHttpServer())
      .post('/items')
      .send(testItem)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('alt_id');
        expect(res.body.name).toBe(testItem.name);
        expect(res.body.description).toBe(testItem.description);
        expect(res.body.unit_price).toBe(testItem.unit_price);

        // Save the created item ID for later tests
        createdItemId = res.body.id;
      });
  });

  it('should get all items', () => {
    return request(app.getHttpServer())
      .get('/items')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('should get an item by ID', () => {
    return request(app.getHttpServer())
      .get(`/items/${createdItemId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdItemId);
        expect(res.body.name).toBe(testItem.name);
      });
  });

  it('should update an item', () => {
    return request(app.getHttpServer())
      .put(`/items/${createdItemId}`)
      .send(updatedItem)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdItemId);
        expect(res.body.name).toBe(updatedItem.name);
        expect(res.body.description).toBe(updatedItem.description);
        expect(res.body.unit_price).toBe(updatedItem.unit_price);
      });
  });

  it('should delete an item', () => {
    return request(app.getHttpServer())
      .delete(`/items/${createdItemId}`)
      .expect(200);
  });

  it('should return 404 for a deleted item', () => {
    return request(app.getHttpServer())
      .get(`/items/${createdItemId}`)
      .expect(404);
  });
});
