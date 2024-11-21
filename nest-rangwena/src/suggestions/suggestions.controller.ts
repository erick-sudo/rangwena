import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { SuggestionsService } from './suggestions.service';
import {
  CreateSuggestionDto,
  SuggestionToggleDto,
} from './dto/create-suggestion.dto';
import { UpdateSuggestionDto } from './dto/update-suggestion.dto';
import { Prisma } from '@prisma/client';

@Controller('suggestions')
export class SuggestionsController {
  constructor(private readonly suggestionsService: SuggestionsService) {}

  @Post()
  create(
    @Body() createSuggestionDto: CreateSuggestionDto,
    @Request() req: ExpressRequest,
  ) {
    return this.suggestionsService.create(
      createSuggestionDto,
      req.authentication?.principal!!,
    );
  }

  @Post(':id/toggle')
  async toggle(
    @Param('id') id: string,
    @Body() payload: SuggestionToggleDto,
    @Request() req: ExpressRequest,
  ) {
    return await this.suggestionsService.toggle(
      id,
      payload,
      req.authentication?.principal!!,
    );
  }

  @Get()
  findAll() {
    return this.suggestionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.suggestionsService.findOne(id);
  }

  @Get(':id/count-reactions')
  countReactions(@Param('id') id: string, @Request() req: ExpressRequest) {
    return this.suggestionsService.countReactions(
      id,
      req.authentication?.principal!!,
    );
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateSuggestionDto: UpdateSuggestionDto,
  ) {
    return this.suggestionsService.update(
      id,
      updateSuggestionDto as Prisma.SuggestionUpdateInput,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.suggestionsService.remove(id);
  }
}
