import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

/**
 * Helper function to get a JWT token for testing
 * @param app The NestJS application instance
 * @returns A Promise that resolves to the JWT token
 */
export async function getAuthToken(app: INestApplication): Promise<string> {
  // Basic auth credentials (base64 encoded 'client_id:secret')
  const basicAuth = 'Basic Y2xpZW50X2lkOnNlY3JldA==';

  const response = await request(app.getHttpServer())
    .post('/authorize')
    .set('Authorization', basicAuth)
    .expect(201);

  return response.body.token;
}
