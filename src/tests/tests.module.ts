import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AiModule } from '../ai/ai.module';
import { UserModule } from '../user/user.module';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { AiService } from '../ai/ai.service';
import { AudioService } from '../audio/audio.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [TestsController],
  providers: [TestsService, AiService, AudioService],
})
export class TestsModule {}