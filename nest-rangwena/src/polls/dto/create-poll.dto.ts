import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Length,
} from 'class-validator';

export class CreatePollDto {
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsNotEmpty({ message: 'description is required' })
  @Length(1, 500)
  description: string;

  @IsInt()
  totalNumberOfvoters: number;

  @IsOptional()
  @IsBoolean()
  closed: boolean;
}

export class CreatePollChoiceDto {
  @IsNotEmpty({ message: 'choice cannot be empty' })
  value: string;
}
