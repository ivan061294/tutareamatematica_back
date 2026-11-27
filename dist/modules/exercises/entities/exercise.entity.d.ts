export declare enum ExerciseDifficulty {
    EASY = "easy",
    MEDIUM = "medium",
    HARD = "hard"
}
export declare enum ExerciseType {
    MULTIPLE_CHOICE = "multiple_choice",
    OPEN_ENDED = "open_ended",
    TRUE_FALSE = "true_false",
    FILL_BLANK = "fill_blank"
}
export declare class ExerciseOption {
    id: string;
    text: string;
    isCorrect?: boolean;
}
export declare class Exercise {
    id: string;
    courseId: string;
    title: string;
    problem: string;
    problemLatex?: string;
    type: ExerciseType;
    difficulty: ExerciseDifficulty;
    options?: ExerciseOption[];
    correctAnswer: string;
    explanation: string;
    hints?: string[];
    imageUrl?: string;
    topic: string;
    points: number;
    isPublished: boolean;
    attemptCount: number;
    successRate: number;
    createdAt: string;
    updatedAt: string;
}
