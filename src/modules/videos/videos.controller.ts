import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VideosService } from './videos.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('videos')
@Controller('videos')
export class VideosController {
  constructor(private readonly videosService: VideosService) {}

  @Get()
  findAll(@Query('courseId') courseId?: string) {
    return this.videosService.findAll(courseId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.videosService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() data: any) {
    return this.videosService.create(data);
  }

  @Post(':id/view')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  incrementView(@Param('id') id: string) {
    return this.videosService.incrementViews(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: any) {
    return this.videosService.update(id, data);
  }
}
