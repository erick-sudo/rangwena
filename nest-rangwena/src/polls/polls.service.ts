import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePollChoiceDto, CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Principal } from 'src/auth/authentication/authentication.guard';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PollsService {
  constructor(private prisma: PrismaService) {}

  async create(createPollDto: CreatePollDto, choices: CreatePollChoiceDto[]) {
    const { title, description, totalNumberOfvoters } = createPollDto;
    const poll = await this.prisma.poll.create({
      data: {
        title: title,
        description: description,
        totalNumberOfvoters: totalNumberOfvoters,
        closed: false,
      },
    });

    await this.prisma.pollChoice.createMany({
      data: choices.map((choice) => ({
        pollId: poll.id,
        value: choice.value,
      })),
    });

    return await this.prisma.poll.findFirst({
      where: {
        id: poll.id,
      },
      include: {
        choices: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });
  }

  async findAll() {
    return await this.prisma.poll.findMany({
      include: {
        choices: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });
  }

  findOne(id: string) {
    return this.prisma.poll.findUniqueOrThrow({
      where: { id },
      include: {
        choices: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });
  }

  async update(id: string, updatePollDto: UpdatePollDto) {
    return await this.prisma.poll.update({
      where: { id },
      data: updatePollDto,
      include: {
        choices: {
          select: {
            id: true,
            value: true,
          },
        },
      },
    });
  }

  async remove(id: string) {
    await this.prisma.poll.delete({
      where: { id },
    });
    return null;
  }

  async voteStatus(
    id: string,
    currentUser: Principal,
  ): Promise<{ voted: boolean }> {
    const poll = await this.ensureExistsById(id);
    const vote = await this.findVoteByPollAndUserId(poll.id, currentUser.id);
    return {
      voted: !!vote,
    };
  }

  async castVote(id: string, currentUser: Principal, choice: string) {
    const poll = await this.ensureExistsById(id);
    const pollChoice = poll.choices.find(
      (pollChoice) => pollChoice.value === choice,
    );
    if (!pollChoice) {
      throw new UnprocessableEntityException(
        'Sorry! You have provided an invalid choice for this poll.',
      );
    }
    const vote = await this.findVoteByPollAndUserId(poll.id, currentUser.id);
    if (vote) {
      throw new ConflictException('Sorry! You have already cast your vote.');
    } else {
      await this.prisma.vote.create({
        data: {
          pollId: poll.id,
          userId: currentUser.id,
          choiceId: pollChoice.id,
        },
      });
    }

    return poll;
  }

  async tally(pollId: string) {
    const choiceTally = await this.prisma.vote.groupBy({
      by: ['choiceId'],
      where: {
        pollId: pollId,
      },
      _count: {
        choiceId: true,
        _all: true,
      },
    });

    return choiceTally.reduce(
      (acc, curr) => {
        acc[curr.choiceId] = curr._count.choiceId;
        return acc;
      },
      {} as Record<string, number>,
    );
  }

  async ensureExistsById(pollId: string) {
    return await this.prisma.poll.findUniqueOrThrow({
      where: { id: pollId },
      include: {
        choices: true,
      },
    });
  }

  async findVoteByPollAndUserId(pollId: string, userId: string) {
    return await this.prisma.vote.findFirst({
      where: {
        pollId,
        userId,
      },
    });
  }
}
