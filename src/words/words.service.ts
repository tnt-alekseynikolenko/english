import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { DatabaseService } from '../database/database.service';
import { Word } from './types/word.type';
import { DatabaseError } from '../database/types/database-error.type';
import { AiService } from '../ai/ai.service';
import { TranslateWordDto } from './dto/translate-word.dto';
import { VocabularyService } from '../vocabulary/vocabulary.service';
import { UserService } from '../user/user.service';
import {
  BadGatewayException,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class WordsService {
constructor(
    private readonly database: DatabaseService,
    private readonly aiService: AiService,
    private readonly vocabularyService: VocabularyService,
    private readonly userService: UserService,
  ) {}

  async translate(dto: TranslateWordDto) {
    try {

      const result = await this.aiService.translateWord(dto.word);
      if (!result) {
        throw new BadGatewayException('AI returned an empty response');
      }
    
      const word = JSON.parse(result);
      if (
        typeof word !== 'object' ||
        word === null ||
        Array.isArray(word) ||
        !('word' in word) ||
        !('translations' in word)
      ) {
        throw new BadGatewayException('AI returned an invalid response');
      }

      const userId = this.userService.getUser();

      await Promise.all(
        word.translations.map(async (translation: any) => {
          if (translation.translation) {
            translation.inVocabulary =
              await this.vocabularyService.exists(
                word.word,
                translation.translation,
                userId,
              );
          }
        }),
      );

      return word;
  } catch (e) {
   if (e instanceof BadGatewayException) {
      throw e;
    }

    throw new BadGatewayException('Invalid JSON response from AI');
  }
    
  }

  async add(word: string, transcription: string): Promise<Word | null> {
    const result = await this.database.query<Word>(
      `WITH inserted AS (
        INSERT INTO words (word, transcription)
        VALUES ($1, $2)
        ON CONFLICT (word) DO NOTHING
        RETURNING *
      )
      SELECT *
      FROM inserted

      UNION ALL

      SELECT *
      FROM words
      WHERE word = $1
      LIMIT 1`,
      [word, transcription],
    );

    return result.rows[0] ?? null;
  }
}
