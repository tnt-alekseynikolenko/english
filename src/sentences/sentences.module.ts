import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { DatabaseModule } from '../database/database.module';
import { SentencesController } from './sentences.controller';
import { SentencesService } from './sentences.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [SentencesController],
  providers: [SentencesService],
  exports: [SentencesService],
})
export class SentencesModule {}