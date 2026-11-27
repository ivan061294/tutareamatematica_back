import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
export declare class Video {
    id: string;
    courseId: string;
    title: string;
    description: string;
    youtubeUrl?: string;
    s3Url?: string;
    thumbnailUrl?: string;
    duration: number;
    order: number;
    isFree: boolean;
    isPublished: boolean;
    viewCount: number;
    createdAt: string;
    updatedAt: string;
}
export declare class VideosService {
    private readonly repo;
    constructor(client: DynamoDBDocumentClient, config: ConfigService);
    create(data: Partial<Video>): Promise<Video>;
    findAll(courseId?: string): Promise<import("../../database/interfaces/base-repository.interface").FindResult<Video>>;
    findById(id: string): Promise<Video>;
    incrementViews(id: string): Promise<Video>;
    update(id: string, data: Partial<Video>): Promise<Video>;
}
