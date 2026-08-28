import { forwardRef, Module } from '@nestjs/common';
import { WordsController } from './words.controller';
import { WordsService } from './words.service';
import { DatabaseModule } from '../database/database.module';
import { AiModule } from '../ai/ai.module';
import { TranslationService } from './translation.service';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { VocabularyModule } from '../vocabulary/vocabulary.module';

@Module({
  imports: [DatabaseModule, AiModule, UserModule, forwardRef(() => VocabularyModule)],
  controllers: [WordsController],
  providers: [WordsService, TranslationService, UserService],
  exports: [WordsService, TranslationService],
})
export class WordsModule {}