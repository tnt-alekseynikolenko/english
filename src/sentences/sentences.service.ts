import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TestSentence } from '../tests/types/test-sentence.type';

@Injectable()
export class SentencesService {
constructor(
    private readonly database: DatabaseService,
  ) {}

async add(
  userId: number,
  sentence: string,
  translation: string,
  sentenceAudioId: number,
  translationAudioId: number
): Promise<number> {
  const result = await this.database.query(
    `INSERT INTO sentences (user_id, sentence, translation, sentence_audio_id, translation_audio_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id`,
    [userId, sentence, translation, sentenceAudioId, translationAudioId],
  );

  return result.rows[0].id;
}

  async getList(): Promise<TestSentence[]> {
    try {
      const result = await this.database.query<TestSentence>(
        `SELECT id, sentence, translation
         FROM sentences
         ORDER BY id DESC`,
      );

      return result.rows;

    } catch (error) {
      throw error;
    }
  }

  async getCount(): Promise<number> {
    try {
      const result = await this.database.query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM sentences`,
      ); 
    
      return parseInt(result.rows[0].count, 10);
    } catch (error) {
      throw error;
    }
  }    
}