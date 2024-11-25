import { Injectable } from '@nestjs/common';
import { CreateActivityDto } from './dto/create-activity.dto';
import { UpdateActivityDto } from './dto/update-activity.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ActivitiesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createActivityDto: CreateActivityDto) {
    return await this.prisma.activity.create({
      data: createActivityDto,
    });
  }

  findAll() {
    return this.prisma.activity.findMany();
  }

  findOne(id: string) {
    return this.ensureExistsById(id);
  }

  async update(id: string, updateActivityDto: UpdateActivityDto) {
    return await this.prisma.activity.update({
      where: { id },
      data: updateActivityDto,
    });
  }

  async remove(id: string) {
    await this.prisma.activity.delete({
      where: { id },
    });
    return null;
  }

  async ensureExistsById(activityId: string) {
    return await this.prisma.activity.findUniqueOrThrow({
      where: { id: activityId },
    });
  }
}
