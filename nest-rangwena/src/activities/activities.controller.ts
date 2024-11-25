import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PreAuthorize } from 'src/auth/authorization/authorization.decorators';
import { UserRole } from 'src/auth/authentication/authentication.guard';

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }],
  })
  create(@Body() createActivityDto: CreateActivityDto) {
    return this.activitiesService.create(createActivityDto);
  }

  @Get()
  findAll() {
    return this.activitiesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activitiesService.findOne(id);
  }

  @Patch(':id')
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }],
  })
  update(
    @Param('id') id: string,
    @Body() updateActivityDto: UpdateActivityDto,
  ) {
    return this.activitiesService.update(id, updateActivityDto);
  }

  @Delete(':id')
  @PreAuthorize<UserRole>({
    tokens: [{ name: 'ROLE_ADMIN' }],
  })
  remove(@Param('id') id: string) {
    return this.activitiesService.remove(id);
  }
}
