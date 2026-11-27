import { CoursesRepository } from './repositories/courses.repository';
import { CreateCourseDto } from './dto/create-course.dto';
export declare class CoursesService {
    private readonly coursesRepository;
    constructor(coursesRepository: CoursesRepository);
    create(dto: CreateCourseDto, instructorId: string, instructorName: string): Promise<import("./entities/course.entity").Course>;
    findAll(category?: string, featured?: boolean): Promise<import("../../database/interfaces/base-repository.interface").FindResult<import("./entities/course.entity").Course>>;
    findById(id: string): Promise<import("./entities/course.entity").Course>;
    findBySlug(slug: string): Promise<import("./entities/course.entity").Course>;
    update(id: string, data: Partial<any>): Promise<import("./entities/course.entity").Course>;
    updateStripePriceId(id: string, priceId: string, productId: string): Promise<import("./entities/course.entity").Course>;
    incrementStudentCount(id: string): Promise<import("./entities/course.entity").Course>;
    getStats(): Promise<{
        totalCourses: number;
        totalStudents: number;
        totalExercises: number;
    }>;
}
