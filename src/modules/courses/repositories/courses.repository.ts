import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BaseDynamoRepository } from '../../../database/dynamo/base-dynamo.repository';
import { DYNAMO_CLIENT } from '../../../database/dynamo/dynamo-client.provider';
import { Course, CourseCategory } from '../entities/course.entity';

@Injectable()
export class CoursesRepository extends BaseDynamoRepository<Course> {
  protected readonly tableSuffix = 'courses';

  constructor(
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
    config: ConfigService,
  ) {
    super(client, config);
  }

  async findByCategory(category: CourseCategory) {
    return this.findByIndex('category-index', 'category', category);
  }

  async findBySlug(slug: string): Promise<Course | null> {
    const result = await this.findAll({ filters: { slug } });
    return result.items[0] || null;
  }

  async findPublished() {
    return this.findAll({ filters: { isPublished: true } });
  }

  async findFeatured() {
    return this.findAll({ filters: { isFeatured: true, isPublished: true } });
  }
}
