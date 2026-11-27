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
exports.VideosService = exports.Video = void 0;
const common_1 = require("@nestjs/common");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const config_1 = require("@nestjs/config");
const base_dynamo_repository_1 = require("../../database/dynamo/base-dynamo.repository");
const dynamo_client_provider_1 = require("../../database/dynamo/dynamo-client.provider");
class Video {
}
exports.Video = Video;
let VideosRepository = class VideosRepository extends base_dynamo_repository_1.BaseDynamoRepository {
    constructor(client, config) {
        super(client, config);
        this.tableSuffix = 'videos';
    }
    findByCourse(courseId) {
        return this.findByIndex('courseId-index', 'courseId', courseId);
    }
};
VideosRepository = __decorate([
    __param(0, (0, common_1.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [lib_dynamodb_1.DynamoDBDocumentClient,
        config_1.ConfigService])
], VideosRepository);
let VideosService = class VideosService {
    constructor(client, config) {
        this.repo = new VideosRepository(client, config);
    }
    create(data) {
        return this.repo.create({ ...data, viewCount: 0, isPublished: true });
    }
    async findAll(courseId) {
        if (courseId)
            return this.repo.findByCourse(courseId);
        return this.repo.findAll();
    }
    async findById(id) {
        const video = await this.repo.findById(id);
        if (!video)
            throw new common_1.NotFoundException('Video no encontrado');
        return video;
    }
    async incrementViews(id) {
        const video = await this.findById(id);
        return this.repo.update(id, { viewCount: (video.viewCount || 0) + 1 });
    }
    update(id, data) {
        return this.repo.update(id, data);
    }
};
exports.VideosService = VideosService;
exports.VideosService = VideosService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [lib_dynamodb_1.DynamoDBDocumentClient,
        config_1.ConfigService])
], VideosService);
//# sourceMappingURL=videos.service.js.map