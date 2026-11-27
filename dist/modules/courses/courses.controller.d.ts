import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CoursesController {
    private readonly coursesService;
    constructor(coursesService: CoursesService);
    findAll(category?: string, featured?: boolean): Promise<import("../../database/interfaces/base-repository.interface").FindResult<import("./entities/course.entity").Course>>;
    getStats(): Promise<{
        totalCourses: number;
        totalStudents: number;
        totalExercises: number;
    }>;
    findBySlug(slug: string): Promise<import("./entities/course.entity").Course>;
    findOne(id: string): Promise<import("./entities/course.entity").Course>;
    create(dto: CreateCourseDto, req: any): Promise<import("./entities/course.entity").Course>;
    update(id: string, data: any): Promise<import("./entities/course.entity").Course>;
}
