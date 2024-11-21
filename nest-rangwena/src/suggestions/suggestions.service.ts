import { Injectable } from '@nestjs/common';
import {
  CreateSuggestionDto,
  SuggestionToggleAction,
  SuggestionToggleDto,
} from './dto/create-suggestion.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Principal } from 'src/auth/authentication/authentication.guard';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SuggestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

  async create(
    createSuggestionDto: CreateSuggestionDto,
    loggedInUser: Principal,
  ) {
    const { title, description } = createSuggestionDto;
    return await this.prisma.suggestion.create({
      data: {
        title: `${title}`,
        description: `${description}`,
        userId: loggedInUser.id,
      },
    });
  }

  async findAll() {
    const suggestions = await this.prisma.suggestion.findMany({
      include: {
        user: true,
      },
    });
    // const suggestions = await this.prisma.$queryRaw`SELECT s.title, u.username FROM "Suggestion" s LEFT JOIN "User" u ON s.id = s.userId`;
    return suggestions.map(
      ({
        id,
        title,
        description,
        resolved,
        userId,
        createdAt,
        updatedAt,
        user,
      }) => ({
        id,
        title,
        description,
        resolved,
        createdAt,
        updatedAt,
        userId,
        user: user.username,
      }),
    );
  }

  async findOne(id: string) {
    return await this.ensureExistsById(id);
  }

  update(id: string, data: Prisma.SuggestionUpdateInput) {
    return this.prisma.suggestion.update({
      where: { id },
      data: data,
    });
  }

  async toggle(
    id: string,
    payload: SuggestionToggleDto,
    loggedInUser: Principal,
  ) {
    let suggestion = await this.ensureExistsById(id);
    if (
      payload.action === SuggestionToggleAction.like ||
      payload.action === SuggestionToggleAction.dislike
    ) {
      const reaction = await this.prisma.suggestionReaction.findFirst({
        where: {
          suggestionId: id,
          userId: loggedInUser.id,
        },
      });
      if (reaction) {
        await this.prisma.suggestionReaction.update({
          where: { id: reaction.id },
          data: {
            reaction: payload.action,
          },
        });
      } else {
        await this.prisma.suggestionReaction.create({
          data: {
            reaction: payload.action,
            userId: loggedInUser.id,
            suggestionId: suggestion.id,
          },
        });
      }
    } else if (
      payload.action === SuggestionToggleAction.resolve ||
      payload.action === SuggestionToggleAction.unresolve
    ) {
      suggestion = await this.prisma.suggestion.update({
        where: { id: suggestion.id },
        data: {
          resolved: payload.action === SuggestionToggleAction.resolve,
        },
      });
    } else {
      await this.prisma.suggestionReaction.deleteMany({
        where: {
          suggestionId: id,
          userId: loggedInUser.id,
        },
      });
    }

    const user = await this.usersService.ensureExistsById(suggestion.userId);
    return { ...suggestion, user: user.username };
  }

  async countReactions(id: string, loggedInUser: Principal) {
    const reactions = await this.prisma.suggestionReaction.groupBy({
      by: ['reaction'],
      where: {
        suggestionId: id,
      },
      _count: {
        reaction: true,
      },
    });
    const loggedInUserReaction = await this.prisma.suggestionReaction.findFirst(
      {
        where: {
          suggestionId: id,
          userId: loggedInUser.id,
        },
      },
    );
    return {
      ...reactions.reduce(
        (acc, curr) => {
          acc[curr.reaction] = curr._count.reaction;
          return acc;
        },
        { like: 0, dislike: 0 } as Record<string, number>,
      ),
      me: loggedInUserReaction?.reaction || null,
    };
  }

  async remove(id: string) {
    await this.prisma.suggestion.delete({
      where: { id },
    });
    return null;
  }

  async ensureExistsById(suggestionId: string) {
    return await this.prisma.suggestion.findUniqueOrThrow({
      where: { id: suggestionId },
    });
  }
}
