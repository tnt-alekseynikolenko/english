import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AiModule } from '../ai/ai.module';
import { UserModule } from '../user/user.module';
import { TestsController } from './tests.controller';
import { TestsService } from './tests.service';
import { AiService } from '../ai/ai.service';

@Module({
  imports: [DatabaseModule, UserModule],
  controllers: [TestsController],
  providers: [TestsService, AiService],
})
export class TestsModule {}