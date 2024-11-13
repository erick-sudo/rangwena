import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  PasswordResetDto,
  PasswordResetRequestDto,
  SignInDto,
} from 'src/users/user.dtos';
import { AuthenticatedUser } from 'src/users/user.authenticated';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async signIn({ identity, password }: SignInDto) {
    // Attempt to find use by either username, email or phone number
    const user =
      await this.usersService.findByUsernameOrEmailOrPhoneNumber(identity);
    const authenticatedUser = new AuthenticatedUser(user);
    if (!authenticatedUser.verifyPassword(password)) {
      throw new UnauthorizedException('Wrong password');
    }

    const payload = { sub: user.id, email: user.email };

    return { access_token: await this.jwtService.signAsync(payload, {}) };
  }

  async passwordResetRequest({ identity }: PasswordResetRequestDto) {
    const user =
      await this.usersService.findByUsernameOrEmailOrPhoneNumber(identity);

    // Send mail
    await this.mailService.respondToPasswordResetRequest(user);

    return {
      message:
        'Please follow the instructions sent to your email to reset your password.',
    };
  }

  async passwordReset({ newPassword, otp }: PasswordResetDto) {
    // const user =
    //   await this.usersService.findByUsernameOrEmailOrPhoneNumber(otp);

    return {
      message: 'You have successfully reset your password.',
    };
  }
}
