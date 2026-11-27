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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcryptjs");
const users_repository_1 = require("./repositories/users.repository");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    constructor(usersRepository, config) {
        this.usersRepository = usersRepository;
        this.config = config;
    }
    async create(dto) {
        const existing = await this.usersRepository.findByEmail(dto.email);
        if (existing)
            throw new common_1.ConflictException('El email ya está registrado');
        const rounds = this.config.get('app.bcryptRounds');
        const hashedPassword = await bcrypt.hash(dto.password, rounds);
        const user = await this.usersRepository.create({
            ...dto,
            password: hashedPassword,
            role: dto.role || user_entity_1.UserRole.STUDENT,
            isActive: true,
            emailVerified: false,
            enrolledCourses: [],
        });
        return this.sanitize(user);
    }
    async findById(id) {
        const user = await this.usersRepository.findById(id);
        if (!user)
            throw new common_1.NotFoundException('Usuario no encontrado');
        return user;
    }
    async findByEmail(email) {
        return this.usersRepository.findByEmail(email);
    }
    async findAll() {
        const result = await this.usersRepository.findAll();
        return { ...result, items: result.items.map(this.sanitize) };
    }
    async update(id, data) {
        await this.findById(id);
        if (data.password) {
            const rounds = this.config.get('app.bcryptRounds');
            data.password = await bcrypt.hash(data.password, rounds);
        }
        const updated = await this.usersRepository.update(id, data);
        return this.sanitize(updated);
    }
    async enrollInCourse(userId, courseId) {
        const user = await this.findById(userId);
        const enrolled = user.enrolledCourses || [];
        if (!enrolled.includes(courseId)) {
            await this.usersRepository.update(userId, {
                enrolledCourses: [...enrolled, courseId],
            });
        }
    }
    sanitize(user) {
        const { password, ...rest } = user;
        return rest;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_repository_1.UsersRepository,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map