import { Body, Controller, Post, Get, NotFoundException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AddSentenceDto } from './dto/add-sentence.dto';
import { SentencesService } from './sentences.service';

@Controller('sentences')
export class SentencesController {
  constructor(
    private readonly sentencesService: SentencesService,
     private readonly userService: UserService,
  ) {}

  @Post('add')
  async add(@Body() dto: AddSentenceDto) {
    const userId = this.userService.getUser();
    const sentence = await this.sentencesService.add(userId, dto.sentence, dto.translation);
    if (!sentence) {
        throw new NotFoundException('Sentence not found');
    }
  }

  @Get('list')
  async getList() {
    return await this.sentencesService.getList();
  }
}
