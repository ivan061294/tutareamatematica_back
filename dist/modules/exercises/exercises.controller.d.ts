import { ExercisesService } from './exercises.service';
export declare class ExercisesController {
    private readonly exercisesService;
    constructor(exercisesService: ExercisesService);
    findAll(courseId?: string): Promise<import("../../database/interfaces/base-repository.interface").FindResult<import("./entities/exercise.entity").Exercise>>;
    getStats(): Promise<{
        totalExercises: number;
        totalAttempts: number;
        avgSuccessRate: number;
    }>;
    findOne(id: string): Promise<import("./entities/exercise.entity").Exercise>;
    create(data: any): Promise<import("./entities/exercise.entity").Exercise>;
    update(id: string, data: any): Promise<import("./entities/exercise.entity").Exercise>;
    submit(id: string, body: {
        answer: string;
    }): Promise<{
        correct: boolean;
        explanation: string;
        correctAnswer?: string;
    }>;
}
