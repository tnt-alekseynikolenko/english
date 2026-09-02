import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestsService } from './tests.service';
import { UserService } from '../user/user.service';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService, private readonly userService: UserService) {}

  private async getWord(showLastWords: boolean = false) {
    const userId = this.userService.getUser();
    return await this.testsService.getWord(userId, showLastWords);   
  }

  private async getSentence(showLastSentences: boolean = false) {
    const userId = this.userService.getUser();
    return await this.testsService.getSentence(userId, showLastSentences);   
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
  async sentence() {
    return await this.getSentence();
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
