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
exports.CoursesRepository = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const base_dynamo_repository_1 = require("../../../database/dynamo/base-dynamo.repository");
const dynamo_client_provider_1 = require("../../../database/dynamo/dynamo-client.provider");
let CoursesRepository = class CoursesRepository extends base_dynamo_repository_1.BaseDynamoRepository {
    constructor(client, config) {
        super(client, config);
        this.tableSuffix = 'courses';
    }
    async findByCategory(category) {
        return this.findByIndex('category-index', 'category', category);
    }
    async findBySlug(slug) {
        const result = await this.findAll({ filters: { slug } });
        return result.items[0] || null;
    }
    async findPublished() {
        return this.findAll({ filters: { isPublished: true } });
    }
    async findFeatured() {
        return this.findAll({ filters: { isFeatured: true, isPublished: true } });
    }
};
exports.CoursesRepository = CoursesRepository;
exports.CoursesRepository = CoursesRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [lib_dynamodb_1.DynamoDBDocumentClient,
        config_1.ConfigService])
], CoursesRepository);
//# sourceMappingURL=courses.repository.js.map