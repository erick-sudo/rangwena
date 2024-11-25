import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationModule } from './auth/authentication/authentication.module';
import { AuthorizationModule } from './auth/authorization/authorization.module';
import { PrismaModule } from './prisma/prisma.module';
import { RolesModule } from './roles/roles.module';
import { UsersModule } from './users/users.module';
import configuration from './config/configuration';
import { UsersService } from './users/users.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from './auth/authentication/authentication.guard';
import { RolesGuard } from './auth/authorization/roles.guard';
import { PasswordService } from './password/password.service';
import { MailModule } from './mail/mail.module';
import { ChatGateway } from './chat/chat.gateway';
import { RedisModule } from './redis/redis.module';
import { SuggestionsModule } from './suggestions/suggestions.module';
import { ActivitiesModule } from './activities/activities.module';
import { PollsModule } from './polls/polls.module';

@Module({
  imports: [
    // Load configurations and variable validations
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.development.env'],
      cache: true,
      expandVariables: true,
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().port().default(3000),
        JWT_SECRET: Joi.string().required(),
        DATABASE_URL: Joi.string().required(),
        VUE_FRONTEND: Joi.string().required(),
        MAIL_SERVICE: Joi.string().required(),
        MAIL_HOST: Joi.string().required(),
        MAIL_PORT: Joi.number().port().default(465),
        MAIL_USER: Joi.string().required(),
        MAIL_PASSWORD: Joi.string().required(),
        MAIL_FROM: Joi.string().default('noreply@example.com'),
      }),
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: `${3600 * 24}s`,
          algorithm: 'HS512',
        },
      }),
    }),
    UsersModule,
    AuthenticationModule,
    AuthorizationModule,
    PrismaModule,
    RolesModule,
    MailModule,
    RedisModule,
    SuggestionsModule,
    ActivitiesModule,
    PollsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    UsersService,
    { provide: APP_GUARD, useClass: AuthenticationGuard },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    PasswordService,
    ChatGateway,
  ],
})
export class AppModule {}
