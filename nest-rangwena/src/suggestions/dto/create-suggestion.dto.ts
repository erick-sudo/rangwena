import { IsEnum, IsNotEmpty, Length } from 'class-validator';

export class CreateSuggestionDto {
  @IsNotEmpty({ message: 'title is required' })
  title: String;

  @IsNotEmpty({ message: 'description is required' })
  @Length(1, 500)
  description: String;
}

export enum SuggestionToggleAction {
  dismiss = 'dismiss',
  like = 'like',
  dislike = 'dislike',
  resolve = 'resolve',
  unresolve = 'unresolve',
}

export class SuggestionToggleDto {
  @IsEnum(SuggestionToggleAction)
  action: SuggestionToggleAction;
}
