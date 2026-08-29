import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AuthModule } from './../../src/auth/auth.module';

describe('AuthController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth POST', () => {
    return request(app.getHttpServer())
      .post('/auth')
      .expect(201)
      .expect((response) => {
        expect(response.body.token).toBeDefined();
        expect(typeof response.body.token).toBe('string');
        expect(response.body.token.length).toBeGreaterThan(5);
      });  
  });

  afterEach(async () => {
    await app.close();
  });
});