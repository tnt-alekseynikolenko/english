import { IsString, Length } from 'class-validator';

export class TranslateWordDto {
  @IsString()
  @Length(1, 100)
  word!: string;
}