import { Controller, Post, Body, Delete, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presigned-url')
  getPresignedUrl(@Body() body: { folder: string; contentType: string; originalName: string }) {
    return this.filesService.getPresignedUploadUrl(body.folder, body.contentType, body.originalName);
  }

  @Delete(':key')
  delete(@Param('key') key: string) {
    return this.filesService.deleteFile(decodeURIComponent(key));
  }
}
