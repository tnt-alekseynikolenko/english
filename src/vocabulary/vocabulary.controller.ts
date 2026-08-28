import { Body, Controller, NotFoundException, Post, Get } from '@nestjs/common';
import { VocabularyService } from './vocabulary.service';
import { UserService } from '../user/user.service';
import { AddToVocabularyDto } from './dto/add-to-vocabulary.dto';
import { WordsService } from '../words/words.service';
import { TranslationService } from '../words/translation.service';

@Controller('vocabulary')
export class VocabularyController {
  constructor(
    private readonly vocabularyService: VocabularyService,
    private readonly userService: UserService,
    private readonly wordsService: WordsService,
    private readonly translationService: TranslationService,
  ) {}

  @Post('add')
  async add(@Body() dto: AddToVocabularyDto) {
    const word = await this.wordsService.add(dto.word, dto.transcription);
    if (!word) {
        throw new NotFoundException('Word not found');
    }

    const translation = await this.translationService.add(word.id, dto.translation, dto.pos);
    if (!translation) {
        throw new NotFoundException('Translation not found');
    }

    const userId = this.userService.getUser();
    const vocabulary = await this.vocabularyService.add(userId, translation.id);
  
    return vocabulary;
  }

  @Get('count')
  async count() {
    const userId = this.userService.getUser();
    const wordsCount = await this.vocabularyService.getUserWordsCount(userId);

    return { wordsCount };
  }
}