import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  ParseArrayPipe,
  BadRequestException,
} from '@nestjs/common';
import { PollsService } from './polls.service';
import { CreatePollChoiceDto, CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Request as ExpressRequest } from 'express';
import { PreAuthorize } from 'src/auth/authorization/authorization.decorators';
import { UserRole } from 'src/auth/authentication/authentication.guard';

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }],
  })
  create(
    @Body('poll') createPollDto: CreatePollDto,
    @Body('choices', new ParseArrayPipe({ items: CreatePollChoiceDto }))
    choices: CreatePollChoiceDto[],
  ) {
    if (choices.length < 2) {
      throw new BadRequestException('please provide at least two choices');
    }
    return this.pollsService.create(createPollDto, choices);
  }

  @Get()
  findAll() {
    return this.pollsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pollsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePollDto: UpdatePollDto) {
    return this.pollsService.update(id, updatePollDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pollsService.remove(id);
  }

  @Get(':id/current-user-status')
  voteStatus(@Param('id') id: string, @Req() req: ExpressRequest) {
    return this.pollsService.voteStatus(id, req.authentication?.principal!!);
  }

  @Get(':id/tally')
  tally(@Param('id') id: string) {
    return this.pollsService.tally(id);
  }

  @Post(':id/cast-vote')
  castVote(
    @Param('id') id: string,
    @Req() req: ExpressRequest,
    @Body('choice') choice: string,
  ) {
    return this.pollsService.castVote(
      id,
      req.authentication?.principal!!,
      choice,
    );
  }
}
