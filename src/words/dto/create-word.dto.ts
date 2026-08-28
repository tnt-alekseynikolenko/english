import { IsString, Length } from 'class-validator';

export class CreateWordDto {
  @IsString()
  @Length(1, 100)
  word!: string;

  @IsString()
  @Length(1, 100)
  translation!: string;
}