import { Module } from '@nestjs/common';
import { SuggestionsService } from './suggestions.service';
import { SuggestionsController } from './suggestions.controller';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [SuggestionsController],
  providers: [SuggestionsService, UsersService, PrismaService],
})
export class SuggestionsModule {}
