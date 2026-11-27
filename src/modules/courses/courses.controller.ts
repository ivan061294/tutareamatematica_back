import { Controller, Get, Post, Put, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags, ApiQuery } from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'featured', required: false, type: Boolean })
  findAll(@Query('category') category?: string, @Query('featured') featured?: boolean) {
    return this.coursesService.findAll(category, featured);
  }

  @Get('stats')
  getStats() {
    return this.coursesService.getStats();
  }

  @Get('slug/:slug')
  findBySlug(@Param('slug') slug: string) {
    return this.coursesService.findBySlug(slug);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  create(@Body() dto: CreateCourseDto, @Request() req) {
    const name = `${req.user.firstName || ''} ${req.user.lastName || ''}`.trim() || req.user.email;
    return this.coursesService.create(dto, req.user.id, name);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() data: any) {
    return this.coursesService.update(id, data);
  }
}
