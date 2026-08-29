import { Body, Controller, Post, Get } from '@nestjs/common';
import { CreateWordDto } from './dto/create-word.dto';
import { WordsService } from './words.service';
import { TranslateWordDto } from './dto/translate-word.dto';
import { UserService } from '../user/user.service';

@Controller('words')
export class WordsController {
  constructor(
    private readonly wordsService: WordsService,
     private readonly userService: UserService,
  ) {}

  @Post()
  create(@Body() dto: CreateWordDto) {
    return dto.translation;
     //return this.wordsService.create(dto);
  }

  @Post('translate')
  async translate(@Body() dto: TranslateWordDto) {
    return await this.wordsService.translate(dto);
  }
}
