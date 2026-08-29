import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { WordsModule } from './../../src/words/words.module';

describe('WordsController', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [WordsModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const word = "apple";
  const translation = "яблуко";
  const fakeWord = "appleee";

  it('/words/translate POST', () => {
    return request(app.getHttpServer())
      .post('/words/translate')
      .send({
        "word": word
      })
      .expect(201)
      .expect((response) => {
        expect(response.body.word).toEqual(word);
        expect(typeof response.body.word).toBe('string');
        expect(typeof response.body.transcription).toBe('string');
        expect(Array.isArray(response.body.translations)).toBe(true);
        expect(typeof response.body.translations[0].translation).toBe('string');
        expect(response.body.translations.length).toBeGreaterThan(0);
        expect(response.body.translations[0].translation).toEqual(translation);
        expect(typeof response.body.translations[0].pos).toBe('string');
        expect(typeof response.body.translations[0].recommended).toBe('boolean');
        expect(typeof response.body.translations[0].inVocabulary).toBe('boolean');
        });
  });

  it('/words/translate POST', () => {
    return request(app.getHttpServer())
      .post('/words/translate')
      .send({
        "word": fakeWord
      })
      .expect(502)
  });

  afterEach(async () => {
    await app.close();
  });
});