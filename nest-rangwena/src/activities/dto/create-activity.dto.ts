import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

export class CreateActivityDto {
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @IsNotEmpty({ message: 'description is required' })
  @Length(1, 500)
  description: string;

  @IsDateString()
  date: string;

  @IsOptional()
  @IsUrl()
  image?: string;

  @IsOptional()
  @IsBoolean()
  completed: boolean;
}
