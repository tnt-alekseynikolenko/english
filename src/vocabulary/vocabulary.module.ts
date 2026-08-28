import { forwardRef, Module } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { VocabularyController } from './vocabulary.controller';
import { DatabaseModule } from '../database/database.module';
import { UserModule } from '../user/user.module';
import { WordsModule } from '../words/words.module';

@Module({
  imports: [DatabaseModule, UserModule, forwardRef(() => WordsModule)],
  controllers: [VocabularyController],
  providers: [VocabularyService],
  exports: [VocabularyService],
})
export class VocabularyModule {}