import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsStrongPassword,
  ValidateIf,
} from 'class-validator';
import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsMatching } from 'src/validators/ismatching.validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'first name is required' })
  firstName: string;

  @IsNotEmpty({ message: 'last name is required' })
  lastName: string;

  @IsNotEmpty({ message: 'last name is required' })
  username: string;

  @IsEmail({}, { message: 'invalid email address' })
  email: string;

  @IsPhoneNumber('KE', { message: 'a valid phone number is required' })
  phoneNumber: string;

  @IsStrongPassword({ minLength: 8 }, { message: 'weak password' })
  password: string;

  @ValidateIf((o, v) => !!o.password && !!o.confirmPassword)
  @IsMatching('password', { message: 'passwords do not match' })
  confirmPassword: string;
}

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['password', 'confirmPassword', 'email', 'phoneNumber'] as const),
) {}

export class SignInDto {
  @IsNotEmpty({ message: 'an email, a phone number, or a username is required' })
  identity: string;

  @IsNotEmpty({ message: 'a password is required' })
  password: string;
}
