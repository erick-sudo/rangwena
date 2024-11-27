import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import {
  ActivateAccountDto,
  AuthenticatedOtpRequest,
  PasswordResetDto,
  PasswordResetRequestDto,
  PublicOtpRequest,
  SignInDto,
} from 'src/users/user.dtos';
import { AuthenticatedUser } from 'src/users/user.authenticated';
import { MailService } from 'src/mail/mail.service';
import { Principal } from './authentication.guard';
import { ConfigService } from '@nestjs/config';
import { OtpService } from 'src/otp/otp.service';
import { PasswordService } from 'src/password/password.service';
import { PrismaService } from 'src/prisma/prisma.service';

export type OtpRequestReason = 'password-reset' | 'account-approval';

@Injectable()
export class AuthenticationService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private configService: ConfigService,
    private otpService: OtpService,
    private prisma: PrismaService,
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

    return {
      access_token: await this.jwtService.signAsync(payload, {}),
      approved: user.approved,
    };
  }

  async passwordResetRequest({ identity }: PasswordResetRequestDto) {
    const user =
      await this.usersService.findByUsernameOrEmailOrPhoneNumber(identity);

    const host = this.configService.get<string>('VUE_FRONTEND');
    const path = '/reset-password';
    const url = `${host}${path}`;

    const otp = await this.otpService.create(user.id);

    // Send mail
    await this.mailService.sendPasswordResetRequestMail({
      options: {
        subject: 'Reset your password',
        to: user.email,
        template: 'password-reset',
      },
      context: {
        otp: otp.value,
        uiURL: url,
        name: user.firstName,
      },
    });

    return {
      message:
        'Please follow the instructions sent to your email to reset your password.',
    };
  }

  async requestOtpPublic(otpRequest: PublicOtpRequest) {
    const user = await this.usersService.findByUsernameOrEmailOrPhoneNumber(
      otpRequest.identity,
    );

    return this.prisma.$transaction(async (tx) => {
      // const otp = await this.otpService.create(user.id);
      const otp = await tx.oneTimePassword.upsert({
        where: { userId: user.id },
        update: {
          createdAt: new Date().toISOString(),
        },
        create: {
          value: this.otpService.generateOTP(6),
          userId: user.id,
        },
      });

      // Send otp via mail
      await this.mailService.sendOtpRequestMail({
        options: {
          subject: otpRequest.reason,
          to: user.email,
          template: 'otp-request',
        },
        context: {
          otp: otp.value,
          name: user.firstName,
        },
      });

      return {
        message: 'A one-time-password has been sent your email.',
      };
    });
  }

  async requestOtpAuthenticated(
    otpRequest: AuthenticatedOtpRequest,
    currentUser: Principal,
  ) {
    return this.prisma.$transaction(async () => {
      const otp = await this.otpService.create(currentUser.id);

      // Send otp via mail
      await this.mailService.sendOtpRequestMail({
        options: {
          subject: otpRequest.reason,
          to: currentUser.email,
          template: 'otp-request',
        },
        context: {
          otp: otp.value,
          name: currentUser.username,
        },
      });

      return {
        message: 'A one-time-password has been sent your email.',
      };
    });
  }

  async passwordReset({ newPassword, otp }: PasswordResetDto) {
    const oneTimePassword = await this.otpService.verify(otp);

    const user = oneTimePassword.user;

    await this.usersService.updateUser({
      where: {
        id: user.id,
      },
      data: {
        passwordDigest: PasswordService.hashedPassword(newPassword),
      },
    });

    return {
      message: 'You have successfully reset your password.',
    };
  }

  async activateAccount(activateAccountDto: ActivateAccountDto) {
    const oneTimePassword = await this.otpService.verify(
      activateAccountDto.otp,
    );

    const user = oneTimePassword.user;

    if (!user.approved) {
      throw new ForbiddenException(
        'Sorry! Your account is still pending approval. Please contact your administrator.',
      );
    }

    await this.usersService.updateUser({
      where: {
        id: user.id,
      },
      data: {
        firstName: activateAccountDto.firstName,
        lastName: activateAccountDto.lastName,
        activated: true,
      },
    });

    return {
      message: 'Your account has been activated successfully.',
    };
  }
}
