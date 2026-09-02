import { ConflictException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TestWord } from './types/test-word.type';
import { AiService } from '../ai/ai.service';

@Injectable()
export class TestsService {
constructor(
    private readonly database: DatabaseService,
    private readonly aiService: AiService
  ) {}

  async hasWordsByDisplayFrequency(userId, frequency: string): Promise<boolean> {
    const result = await this.database.query(
      `SELECT 1
      FROM words w
      INNER JOIN translations t ON t.word_id = w.id 
      INNER JOIN vocabulary v ON v.translation_id = t.id 
      WHERE v.user_id = $1 AND w.display_frequency = $2
      LIMIT 1`,
      [userId, frequency],
    );

    return result.rows.length > 0;
  }

  async getWord(userId, showLastWords?: boolean): Promise<TestWord | null> {
    let displayFrequency = Math.floor(Math.random() * 3) === 2 ? "normal" : "more_often";
    if (displayFrequency === "more_often" && !(await this.hasWordsByDisplayFrequency(userId, displayFrequency))) {
      displayFrequency = "normal";
    }

    const result = await this.database.query(`
      SELECT *
        FROM (
        SELECT
            w.id,
            w.word,
            w.transcription,
            w.lang AS lang_word,
            t.id AS translation_id,
            t.translation,
            t.pos,
            COALESCE(s.repeats + 1, 1) AS repeats,
            t.lang AS lang_translation
        FROM words w
        INNER JOIN translations t ON t.word_id = w.id
        INNER JOIN vocabulary v ON v.translation_id = t.id
        LEFT JOIN translations_stat s
            ON s.user_id = v.user_id
            AND s.translation_id = t.id
        WHERE v.user_id = $1
          AND w.display_frequency = $2` + (showLastWords ? ` ORDER BY id DESC LIMIT 20` : ``) + `
      ) x
      ORDER BY RANDOM()
      LIMIT 1;`,
      [userId, displayFrequency],
    );

    return result.rows[0] ?? null;   
  }  

  async updateRepeats(userId, translationId): Promise<void> {
    try { 
      const result = await this.database.query(`
        INSERT INTO translations_stat (translation_id, user_id, repeats)
        VALUES ($1, $2, 1)
        ON CONFLICT (translation_id, user_id)
        DO UPDATE SET
        repeats = translations_stat.repeats + 1`,
        [translationId, userId],
      );
    } catch (error) {
      throw error;
    }    
  }

  async generateSentence(word: TestWord) {
    return await this.aiService.generateSentence(word);
  }

  async generatePhrase(word: TestWord) {
    return await this.aiService.generatePhrase(word);
  }

  async getSentence(userId, showLastSentences?: boolean): Promise<TestWord | null> {
    const result = await this.database.query(`
      SELECT *
        FROM (
        SELECT
            s.id,
            s.sentence AS word,
            NULL AS transcription,
            NULL AS lang_word,
            NULL AS translation_id,
            translation,
            NULL AS pos,
            0 AS repeats,
            NULL AS lang_translation
        FROM sentences s
        WHERE s.user_id = $1` + (showLastSentences ? ` ORDER BY id DESC LIMIT 20` : ``) + `
      ) x
      ORDER BY RANDOM()
      LIMIT 1;`,
      [userId],
    );

    return result.rows[0] ?? null;   
  }  
}
