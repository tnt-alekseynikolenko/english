import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { WordsModule } from './words/words.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { VocabularyModule } from './vocabulary/vocabulary.module';
import { TestsModule } from './tests/tests.module';
import { SentencesModule } from './sentences/sentences.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    WordsModule,
    AuthModule,
    UserModule,
    VocabularyModule,
    TestsModule,
    SentencesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
