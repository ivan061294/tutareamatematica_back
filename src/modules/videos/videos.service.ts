import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
import { BaseDynamoRepository } from '../../database/dynamo/base-dynamo.repository';
import { DYNAMO_CLIENT } from '../../database/dynamo/dynamo-client.provider';

export class Video {
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

class VideosRepository extends BaseDynamoRepository<Video> {
  protected readonly tableSuffix = 'videos';
  constructor(
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
    config: ConfigService,
  ) { super(client, config); }

  findByCourse(courseId: string) {
    return this.findByIndex('courseId-index', 'courseId', courseId);
  }
}

@Injectable()
export class VideosService {
  private readonly repo: VideosRepository;

  constructor(
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
    config: ConfigService,
  ) {
    this.repo = new VideosRepository(client, config);
  }

  create(data: Partial<Video>) {
    return this.repo.create({ ...data, viewCount: 0, isPublished: true });
  }

  async findAll(courseId?: string) {
    if (courseId) return this.repo.findByCourse(courseId);
    return this.repo.findAll();
  }

  async findById(id: string) {
    const video = await this.repo.findById(id);
    if (!video) throw new NotFoundException('Video no encontrado');
    return video;
  }

  async incrementViews(id: string) {
    const video = await this.findById(id);
    return this.repo.update(id, { viewCount: (video.viewCount || 0) + 1 });
  }

  update(id: string, data: Partial<Video>) {
    return this.repo.update(id, data);
  }
}
