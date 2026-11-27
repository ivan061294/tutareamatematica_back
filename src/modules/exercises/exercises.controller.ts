import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { ExercisesService } from './exercises.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('exercises')
@Controller('exercises')
export class ExercisesController {
  constructor(private readonly exercisesService: ExercisesService) {}

  @Get()
  @ApiQuery({ name: 'courseId', required: false })
  findAll(@Query('courseId') courseId?: string) {
    return this.exercisesService.findAll(courseId);
  }

  @Get('stats')
  getStats() {
    return this.exercisesService.getStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exercisesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() data: any) {
    return this.exercisesService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: any) {
    return this.exercisesService.update(id, data);
  }

  @Post(':id/submit')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  submit(@Param('id') id: string, @Body() body: { answer: string }) {
    return this.exercisesService.submitAnswer(id, body.answer);
  }
}
