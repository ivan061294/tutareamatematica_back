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
exports.FilesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const uuid_1 = require("uuid");
let FilesService = class FilesService {
    constructor(config) {
        this.config = config;
        const endpoint = config.get('aws.s3.endpoint');
        this.s3Endpoint = endpoint;
        this.s3 = new client_s3_1.S3Client({
            region: config.get('aws.region'),
            ...(endpoint ? { endpoint, forcePathStyle: true } : {}),
        });
        this.bucket = config.get('aws.s3.bucket');
        this.urlExpiration = config.get('aws.s3.urlExpiration');
    }
    async getPresignedUploadUrl(folder, contentType, originalName) {
        const ext = originalName.split('.').pop();
        const key = `${folder}/${(0, uuid_1.v4)()}.${ext}`;
        const command = new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.s3, command, { expiresIn: this.urlExpiration });
        const publicUrl = this.s3Endpoint
            ? `${this.s3Endpoint}/${this.bucket}/${key}`
            : `https://${this.bucket}.s3.amazonaws.com/${key}`;
        return { uploadUrl: url, publicUrl, key };
    }
    async deleteFile(key) {
        await this.s3.send(new client_s3_1.DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    }
};
exports.FilesService = FilesService;
exports.FilesService = FilesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], FilesService);
//# sourceMappingURL=files.service.js.map