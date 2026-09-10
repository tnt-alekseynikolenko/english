import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { access, readFile } from 'fs/promises';
import path from 'path';
import { AUDIO_DIR } from '../constants/audio';
import { promises as fs } from 'fs';

@Injectable()
export class AudioService {
constructor(
    private readonly database: DatabaseService,
  ) {}

    async add(filename: string, language: "en" | "uk"): Promise<number> {
        const filePath = path.join(AUDIO_DIR, filename);
        const file = await fs.stat(filePath);

        const result = await this.database.query(
            `INSERT INTO audio (filename, size, language)
            VALUES ($1, $2, $3)
            RETURNING id`,
            [filename, file.size, language],
        );

        return result.rows[0].id;
    }

    async getAudioBase64(filename: string): Promise<string | null> {
        if (!filename) {
            return null;
        }

        const filepath = path.join(AUDIO_DIR, filename);
        const file = await readFile(filepath);
        return file.toString('base64');
    }
}