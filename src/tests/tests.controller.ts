import { Body, Controller, Get, Post } from '@nestjs/common';
import { TestsService } from './tests.service';
import { UserService } from '../user/user.service';

@Controller('tests')
export class TestsController {
  constructor(private readonly testsService: TestsService, private readonly userService: UserService) {}

  @Get('word')
  async word() {
    const userId = this.userService.getUser();
    const word = await this.testsService.getWord(userId);

    if (word) {
      await this.testsService.updateRepeats(userId, word.translation_id);
    }

    return word;
  }

  @Get('sentence')
  async sentence() {
    const userId = this.userService.getUser();
    const word = await this.testsService.getWord(userId);

    if (!word) {
      return null;
    }

    return this.testsService.generateSentence(word);
  }

  @Get('phrase')
  async phrase() {
    const userId = this.userService.getUser();
    const word = await this.testsService.getWord(userId);

    if (!word) {
      return null;
    }

    return this.testsService.generatePhrase(word);
  }
}
