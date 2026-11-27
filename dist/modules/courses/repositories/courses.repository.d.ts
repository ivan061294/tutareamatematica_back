import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BaseDynamoRepository } from '../../../database/dynamo/base-dynamo.repository';
import { Course, CourseCategory } from '../entities/course.entity';
export declare class CoursesRepository extends BaseDynamoRepository<Course> {
    protected readonly tableSuffix = "courses";
    constructor(client: DynamoDBDocumentClient, config: ConfigService);
    findByCategory(category: CourseCategory): Promise<import("../../../database/interfaces/base-repository.interface").FindResult<Course>>;
    findBySlug(slug: string): Promise<Course | null>;
    findPublished(): Promise<import("../../../database/interfaces/base-repository.interface").FindResult<Course>>;
    findFeatured(): Promise<import("../../../database/interfaces/base-repository.interface").FindResult<Course>>;
}
