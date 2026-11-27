import { ConfigService } from '@nestjs/config';
export declare class FilesService {
    private readonly config;
    private readonly s3;
    private readonly bucket;
    private readonly urlExpiration;
    private readonly s3Endpoint;
    constructor(config: ConfigService);
    getPresignedUploadUrl(folder: string, contentType: string, originalName: string): Promise<{
        uploadUrl: string;
        publicUrl: string;
        key: string;
    }>;
    deleteFile(key: string): Promise<void>;
}
