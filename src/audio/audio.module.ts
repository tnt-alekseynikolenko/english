import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { AudioService } from './audio.service';

@Module({
  imports: [DatabaseModule],
  controllers: [],
  providers: [AudioService],
  exports: [AudioService],
})
export class AudioModule {}