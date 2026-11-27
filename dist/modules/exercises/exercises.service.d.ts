import { Exercise } from './entities/exercise.entity';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';
export declare class ExercisesService {
    private readonly repo;
    constructor(client: DynamoDBDocumentClient, config: ConfigService);
    create(data: Partial<Exercise>): Promise<Exercise>;
    findAll(courseId?: string): Promise<import("../../database/interfaces/base-repository.interface").FindResult<Exercise>>;
    findById(id: string): Promise<Exercise>;
    update(id: string, data: Partial<Exercise>): Promise<Exercise>;
    submitAnswer(id: string, answer: string): Promise<{
        correct: boolean;
        explanation: string;
        correctAnswer?: string;
    }>;
    getStats(): Promise<{
        totalExercises: number;
        totalAttempts: number;
        avgSuccessRate: number;
    }>;
}
