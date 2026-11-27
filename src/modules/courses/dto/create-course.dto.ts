import { IsString, IsNumber, IsEnum, IsArray, IsBoolean, IsOptional, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CourseCategory, CourseLevel } from '../entities/course.entity';

export class CreateCourseDto {
  @ApiProperty() @IsString() title: string;
  @ApiProperty() @IsString() description: string;
  @ApiProperty() @IsString() shortDescription: string;
  @ApiProperty({ enum: CourseCategory }) @IsEnum(CourseCategory) category: CourseCategory;
  @ApiProperty({ enum: CourseLevel }) @IsEnum(CourseLevel) level: CourseLevel;
  @ApiProperty() @IsNumber() @Min(0) price: number;
  @ApiProperty() @IsNumber() @Min(0) originalPrice: number;
  @ApiProperty({ required: false }) @IsOptional() @IsString() thumbnailUrl?: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() previewVideoUrl?: string;
  @ApiProperty({ type: [String] }) @IsArray() topics: string[];
  @ApiProperty({ type: [String] }) @IsArray() requirements: string[];
  @ApiProperty({ type: [String] }) @IsArray() whatYouLearn: string[];
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isPublished?: boolean;
  @ApiProperty({ required: false }) @IsOptional() @IsBoolean() isFeatured?: boolean;
}
