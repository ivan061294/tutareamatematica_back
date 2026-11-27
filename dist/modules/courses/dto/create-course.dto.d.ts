import { CourseCategory, CourseLevel } from '../entities/course.entity';
export declare class CreateCourseDto {
    title: string;
    description: string;
    shortDescription: string;
    category: CourseCategory;
    level: CourseLevel;
    price: number;
    originalPrice: number;
    thumbnailUrl?: string;
    previewVideoUrl?: string;
    topics: string[];
    requirements: string[];
    whatYouLearn: string[];
    isPublished?: boolean;
    isFeatured?: boolean;
}
