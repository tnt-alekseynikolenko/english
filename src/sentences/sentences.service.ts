import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

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
}