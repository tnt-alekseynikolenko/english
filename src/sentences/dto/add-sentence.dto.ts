import { IsString, Length } from 'class-validator';

export class AddSentenceDto {
  @IsString()
  @Length(1, 100)
  sentence!: string;

  @IsString()
  @Length(1, 100)
  translation!: string;
}