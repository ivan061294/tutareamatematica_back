import { Injectable, NotFoundException } from '@nestjs/common';
import { CoursesRepository } from './repositories/courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseCategory } from './entities/course.entity';

@Injectable()
export class CoursesService {
  constructor(private readonly coursesRepository: CoursesRepository) {}

  async create(dto: CreateCourseDto, instructorId: string, instructorName: string) {
    const slug = dto.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    return this.coursesRepository.create({
      ...dto,
      slug,
      instructorId,
      instructorName,
      currency: 'usd',
      rating: 0,
      reviewCount: 0,
      studentCount: 0,
      totalLessons: 0,
      totalExercises: 0,
      totalVideos: 0,
      totalHours: 0,
      isPublished: dto.isPublished ?? false,
      isFeatured: dto.isFeatured ?? false,
    });
  }

  async findAll(category?: string, featured?: boolean) {
    if (featured) return this.coursesRepository.findFeatured();
    if (category) return this.coursesRepository.findByCategory(category as CourseCategory);
    return this.coursesRepository.findPublished();
  }

  async findById(id: string) {
    const course = await this.coursesRepository.findById(id);
    if (!course) throw new NotFoundException('Curso no encontrado');
    return course;
  }

  async findBySlug(slug: string) {
    const course = await this.coursesRepository.findBySlug(slug);
    if (!course) throw new NotFoundException('Curso no encontrado');
    return course;
  }

  async update(id: string, data: Partial<any>) {
    await this.findById(id);
    return this.coursesRepository.update(id, data);
  }

  async updateStripePriceId(id: string, priceId: string, productId: string) {
    return this.coursesRepository.update(id, {
      stripePriceId: priceId,
      stripeProductId: productId,
    });
  }

  async incrementStudentCount(id: string) {
    const course = await this.findById(id);
    return this.coursesRepository.update(id, {
      studentCount: (course.studentCount || 0) + 1,
    });
  }

  async getStats() {
    const all = await this.coursesRepository.findPublished();
    return {
      totalCourses: all.count,
      totalStudents: all.items.reduce((sum, c) => sum + (c.studentCount || 0), 0),
      totalExercises: all.items.reduce((sum, c) => sum + (c.totalExercises || 0), 0),
    };
  }
}
