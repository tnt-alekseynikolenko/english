import { IsString, Length } from 'class-validator';

export class AddToVocabularyDto {
  @IsString()
  @Length(1, 100)
  word!: string;

  @IsString()
  @Length(1, 100)
  translation!: string;

  @IsString()
  @Length(1, 100)
  transcription!: string;

  @IsString()
  @Length(1, 100)
  pos!: string;
}