import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Person } from '../src/persons/persons.interface';

describe('PersonsController (e2e)', () => {
  let app: INestApplication;
  let createdPersonId: number;

  // Test person data
  const testPerson: Omit<Person, 'id' | 'alt_id'> = {
    name: 'Test Person',
    email: 'test.person@example.com',
  };

  const updatedPerson = {
    name: 'Updated Test Person',
    email: 'updated.test.person@example.com',
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

  it('should create a person', () => {
    return request(app.getHttpServer())
      .post('/persons')
      .send(testPerson)
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body).toHaveProperty('alt_id');
        expect(res.body.name).toBe(testPerson.name);
        expect(res.body.email).toBe(testPerson.email);

        // Save the created person ID for later tests
        createdPersonId = res.body.id;
      });
  });

  it('should get all persons', () => {
    return request(app.getHttpServer())
      .get('/persons')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
      });
  });

  it('should get a person by ID', () => {
    return request(app.getHttpServer())
      .get(`/persons/${createdPersonId}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdPersonId);
        expect(res.body.name).toBe(testPerson.name);
        expect(res.body.email).toBe(testPerson.email);
      });
  });

  it('should get a person by email', () => {
    return request(app.getHttpServer())
      .get(`/persons/email/${testPerson.email}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdPersonId);
        expect(res.body.name).toBe(testPerson.name);
        expect(res.body.email).toBe(testPerson.email);
      });
  });

  it('should update a person', () => {
    return request(app.getHttpServer())
      .put(`/persons/${createdPersonId}`)
      .send(updatedPerson)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdPersonId);
        expect(res.body.name).toBe(updatedPerson.name);
        expect(res.body.email).toBe(updatedPerson.email);
      });
  });

  it('should get a person by updated email', () => {
    return request(app.getHttpServer())
      .get(`/persons/email/${updatedPerson.email}`)
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('id', createdPersonId);
        expect(res.body.name).toBe(updatedPerson.name);
        expect(res.body.email).toBe(updatedPerson.email);
      });
  });

  it('should delete a person', () => {
    return request(app.getHttpServer())
      .delete(`/persons/${createdPersonId}`)
      .expect(200);
  });

  it('should return 404 for a deleted person', () => {
    return request(app.getHttpServer())
      .get(`/persons/${createdPersonId}`)
      .expect(404);
  });
});
