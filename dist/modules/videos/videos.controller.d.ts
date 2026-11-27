import { VideosService } from './videos.service';
export declare class VideosController {
    private readonly videosService;
    constructor(videosService: VideosService);
    findAll(courseId?: string): Promise<import("../../database/interfaces/base-repository.interface").FindResult<import("./videos.service").Video>>;
    findOne(id: string): Promise<import("./videos.service").Video>;
    create(data: any): Promise<import("./videos.service").Video>;
    incrementView(id: string): Promise<import("./videos.service").Video>;
    update(id: string, data: any): Promise<import("./videos.service").Video>;
}
