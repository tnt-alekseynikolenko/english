import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestsService } from './tests.service';
import { UserService } from '../user/user.service';
import { AudioService } from '../audio/audio.service';

@Controller('tests')
export class TestsController {
  constructor(
    private readonly testsService: TestsService, 
    private readonly userService: UserService,
    private readonly audioService: AudioService
  ) {}

  private async getWord(showLastWords: boolean = false) {
    const userId = this.userService.getUser();
    return await this.testsService.getWord(userId, showLastWords);   
  }

  private async getSentence(showLastSentences: boolean = false) {
    const userId = this.userService.getUser();
    const sentences = await this.testsService.getSentence(userId, showLastSentences);  
  
    const result = await Promise.all(
      sentences.map(async (sentence) => ({
        id: sentence.id,
        sentence: sentence.sentence,
        translation: sentence.translation,
        sentence_audio: await this.audioService.getAudioBase64(
          sentence.sentence_audio_filename,
        ),
        translation_audio: await this.audioService.getAudioBase64(
          sentence.translation_audio_filename,
        ),
      })),
    );

    return result;
  }

  @Get('word')
  async word() {
    return this.getWordAndUpdateRepeats(false);
  }

  @Get('word/last')
  async wordLast() {
    return this.getWordAndUpdateRepeats(true);
  }

  private async getWordAndUpdateRepeats(showLastWords = false) {
    const userId = this.userService.getUser();
    const word = await this.getWord(showLastWords);

    if (word) {
      await this.testsService.updateRepeats(userId, word.translation_id);
    }

    return word;
  }

  /*
  @Get('sentence')
  async sentence() {
    const word = await this.getWord();
    if (!word) {
      return null;
    }

    return this.testsService.generateSentence(word);
  }
  */

  @Get('sentence')
  async sentences() {
    return await this.getSentence();
  }

  @Get('sentence/last')
  async lastSentences() {
    return await this.getSentence(true);
  }

  @Get('phrase')
  async phrase() {
    const word = await this.getWord();
    if (!word) {
      return null;
    }

    return this.testsService.generatePhrase(word);
  }
}
