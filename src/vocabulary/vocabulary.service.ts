import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { DatabaseError } from '../database/types/database-error.type';
import { AiService } from '../ai/ai.service';
import { LargeNumberLike } from 'node:crypto';

@Injectable()
export class VocabularyService {
constructor(
    private readonly database: DatabaseService,
  ) {}

  async add(
    userId: number,
    translationId: number,
  ): Promise<void> {
    try { 
    const result = await this.database.query(
      `WITH inserted AS (
        INSERT INTO vocabulary (user_id, translation_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, translation_id) DO NOTHING
        RETURNING *
      )
      SELECT *
      FROM inserted

      UNION ALL

      SELECT *
      FROM vocabulary
      WHERE user_id = $1
      AND translation_id = $2
      LIMIT 1;`,
      [userId, translationId],
    );

    return result.rows[0] ?? null;
  } catch (error) {
    throw error;
  }
}

  async exists(word, translation, userId): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1
      FROM vocabulary v
      INNER JOIN translations t ON v.translation_id = t.id
      INNER JOIN words w ON t.word_id = w.id
      WHERE v.user_id = $1
      AND t.translation = $2 
      AND w.word = $3`,
      [userId, translation, word],
    );

    return result.rows.length > 0;      
  }

  async getUserWordsCount(userId: number): Promise<number> {
    const result = await this.database.query(`
      SELECT COUNT(translation_id) AS count 
      FROM vocabulary 
      WHERE user_id = $1`,
      [userId]
    );

    return result.rows.length > 0 ? Number(result.rows[0].count) : 0;
  }
}