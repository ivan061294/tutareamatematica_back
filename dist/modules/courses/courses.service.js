"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoursesService = void 0;
const common_1 = require("@nestjs/common");
const courses_repository_1 = require("./repositories/courses.repository");
let CoursesService = class CoursesService {
    constructor(coursesRepository) {
        this.coursesRepository = coursesRepository;
    }
    async create(dto, instructorId, instructorName) {
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
    async findAll(category, featured) {
        if (featured)
            return this.coursesRepository.findFeatured();
        if (category)
            return this.coursesRepository.findByCategory(category);
        return this.coursesRepository.findPublished();
    }
    async findById(id) {
        const course = await this.coursesRepository.findById(id);
        if (!course)
            throw new common_1.NotFoundException('Curso no encontrado');
        return course;
    }
    async findBySlug(slug) {
        const course = await this.coursesRepository.findBySlug(slug);
        if (!course)
            throw new common_1.NotFoundException('Curso no encontrado');
        return course;
    }
    async update(id, data) {
        await this.findById(id);
        return this.coursesRepository.update(id, data);
    }
    async updateStripePriceId(id, priceId, productId) {
        return this.coursesRepository.update(id, {
            stripePriceId: priceId,
            stripeProductId: productId,
        });
    }
    async incrementStudentCount(id) {
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
};
exports.CoursesService = CoursesService;
exports.CoursesService = CoursesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [courses_repository_1.CoursesRepository])
], CoursesService);
//# sourceMappingURL=courses.service.js.map