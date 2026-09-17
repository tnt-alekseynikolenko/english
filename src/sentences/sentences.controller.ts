import { Body, Controller, Post, Get, NotFoundException, InternalServerErrorException, Param, ParseIntPipe } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AddSentenceDto } from './dto/add-sentence.dto';
import { SentencesService } from './sentences.service';
import textToAudio from '../lib/TextToSpeech';
import { AudioService } from '../audio/audio.service';

@Controller('sentences')
export class SentencesController {
  constructor(
    private readonly sentencesService: SentencesService,
    private readonly userService: UserService,
    private readonly audioService: AudioService
  ) {}

  @Post('add')
  async add(@Body() dto: AddSentenceDto) {

    const userId = this.userService.getUser();
    const sentenceAudioFilename = await textToAudio(dto.sentence, "en");
    const translationAudioFilename = await textToAudio(dto.translation, "uk");
    const sentenceAudioId = await this.audioService.add(sentenceAudioFilename, "en");
    const translationAudioId = await this.audioService.add(translationAudioFilename, "uk");

    const sentenceId = await this.sentencesService.add(userId, dto.sentence, dto.translation, sentenceAudioId, translationAudioId);
    if (!sentenceId) {
        throw new NotFoundException('Sentence not found');
    } 
  }

  @Get('list')
  async getList() {
    return await this.sentencesService.getList();
  }

  @Get('count')
  async getCount() {
    const count = await this.sentencesService.getCount();
    return { count };
  }

  @Get('lift/:id')
  async liftSentence(@Param('id', ParseIntPipe) sentenceId: number) {
    await this.sentencesService.liftSentence(sentenceId);
  }
}
