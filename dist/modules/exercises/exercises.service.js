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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExercisesService = void 0;
const common_1 = require("@nestjs/common");
const base_dynamo_repository_1 = require("../../database/dynamo/base-dynamo.repository");
const common_2 = require("@nestjs/common");
const dynamo_client_provider_1 = require("../../database/dynamo/dynamo-client.provider");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("@nestjs/config");
let ExercisesRepository = class ExercisesRepository extends base_dynamo_repository_1.BaseDynamoRepository {
    constructor(client, config) {
        super(client, config);
        this.tableSuffix = 'exercises';
    }
    findByCourse(courseId) {
        return this.findByIndex('courseId-index', 'courseId', courseId);
    }
};
ExercisesRepository = __decorate([
    __param(0, (0, common_2.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [lib_dynamodb_1.DynamoDBDocumentClient,
        config_1.ConfigService])
], ExercisesRepository);
let ExercisesService = class ExercisesService {
    constructor(client, config) {
        this.repo = new ExercisesRepository(client, config);
    }
    create(data) {
        return this.repo.create({ ...data, attemptCount: 0, successRate: 0, isPublished: true });
    }
    async findAll(courseId) {
        if (courseId)
            return this.repo.findByCourse(courseId);
        return this.repo.findAll();
    }
    async findById(id) {
        const ex = await this.repo.findById(id);
        if (!ex)
            throw new common_1.NotFoundException('Ejercicio no encontrado');
        return ex;
    }
    update(id, data) {
        return this.repo.update(id, data);
    }
    async submitAnswer(id, answer) {
        const exercise = await this.findById(id);
        const correct = answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
        const newAttempts = (exercise.attemptCount || 0) + 1;
        const currentSuccess = exercise.successRate || 0;
        const newSuccessRate = correct
            ? ((currentSuccess * (newAttempts - 1) + 100) / newAttempts)
            : (currentSuccess * (newAttempts - 1)) / newAttempts;
        await this.repo.update(id, {
            attemptCount: newAttempts,
            successRate: Math.round(newSuccessRate),
        });
        return {
            correct,
            explanation: exercise.explanation,
            ...(!correct && { correctAnswer: exercise.correctAnswer }),
        };
    }
    async getStats() {
        const all = await this.repo.findAll();
        return {
            totalExercises: all.count,
            totalAttempts: all.items.reduce((sum, e) => sum + (e.attemptCount || 0), 0),
            avgSuccessRate: all.count
                ? Math.round(all.items.reduce((sum, e) => sum + (e.successRate || 0), 0) / all.count)
                : 0,
        };
    }
};
exports.ExercisesService = ExercisesService;
exports.ExercisesService = ExercisesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_2.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [lib_dynamodb_1.DynamoDBDocumentClient,
        config_1.ConfigService])
], ExercisesService);
//# sourceMappingURL=exercises.service.js.map