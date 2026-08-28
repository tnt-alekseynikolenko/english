import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { DatabaseService } from '../database/database.service';
import { Word } from './types/word.type';
import { DatabaseError } from '../database/types/database-error.type';
import { AiService } from '../ai/ai.service';
import { TranslateWordDto } from './dto/translate-word.dto';
import { Translation } from './types/translation.type';

@Injectable()
export class TranslationService {
constructor(
    private readonly database: DatabaseService,
  ) {}

  async add(
    word_id: number,
    translation: string,
    pos: string
    ): Promise<Translation | null> {
    const result = await this.database.query<Translation>(
        `WITH inserted AS (
            INSERT INTO translations (word_id, translation, pos)
            VALUES ($1, $2, $3)
            ON CONFLICT (word_id, lang, translation) DO NOTHING
            RETURNING *
        )
        SELECT *
        FROM inserted

        UNION ALL

        SELECT *
        FROM translations
        WHERE word_id = $1 AND translation = $2`,
        [word_id, translation, pos],
        );

        return result.rows[0] ?? null;
    }
}