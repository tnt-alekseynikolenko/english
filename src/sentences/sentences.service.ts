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
  ): Promise<boolean> {
    try { 
    const result = await this.database.query(
      `INSERT INTO sentences (user_id, sentence, translation)
        VALUES ($1, $2, $3)`,
      [userId, sentence, translation],
    );

    return true;
  } catch (error) {
    throw error;
  }
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
}