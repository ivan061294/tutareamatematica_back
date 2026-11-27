import { FilesService } from './files.service';
export declare class FilesController {
    private readonly filesService;
    constructor(filesService: FilesService);
    getPresignedUrl(body: {
        folder: string;
        contentType: string;
        originalName: string;
    }): Promise<{
        uploadUrl: string;
        publicUrl: string;
        key: string;
    }>;
    delete(key: string): Promise<void>;
}
