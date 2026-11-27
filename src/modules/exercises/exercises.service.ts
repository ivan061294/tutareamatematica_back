import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseDynamoRepository } from '../../database/dynamo/base-dynamo.repository';
import { Exercise } from './entities/exercise.entity';
import { Inject } from '@nestjs/common';
import { DYNAMO_CLIENT } from '../../database/dynamo/dynamo-client.provider';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { ConfigService } from '@nestjs/config';

class ExercisesRepository extends BaseDynamoRepository<Exercise> {
  protected readonly tableSuffix = 'exercises';
  constructor(
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
    config: ConfigService,
  ) { super(client, config); }

  findByCourse(courseId: string) {
    return this.findByIndex('courseId-index', 'courseId', courseId);
  }
}

@Injectable()
export class ExercisesService {
  private readonly repo: ExercisesRepository;

  constructor(
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
    config: ConfigService,
  ) {
    this.repo = new ExercisesRepository(client, config);
  }

  create(data: Partial<Exercise>) {
    return this.repo.create({ ...data, attemptCount: 0, successRate: 0, isPublished: true });
  }

  async findAll(courseId?: string) {
    if (courseId) return this.repo.findByCourse(courseId);
    return this.repo.findAll();
  }

  async findById(id: string) {
    const ex = await this.repo.findById(id);
    if (!ex) throw new NotFoundException('Ejercicio no encontrado');
    return ex;
  }

  update(id: string, data: Partial<Exercise>) {
    return this.repo.update(id, data);
  }

  async submitAnswer(id: string, answer: string): Promise<{ correct: boolean; explanation: string; correctAnswer?: string }> {
    const exercise = await this.findById(id);
    const correct = answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();

    const newAttempts = (exercise.attemptCount || 0) + 1;
    const currentSuccess = exercise.successRate || 0;
    const newSuccessRate = correct
      ? ((currentSuccess * (newAttempts - 1) + 100) / newAttempts)
      : (currentSuccess * (newAttempts - 1)) / newAttempts;

    await this.repo.update(id, {
      attemptCount: newAttempts,
      successRate: Math.round(newSuccessRate),
    });

    return {
      correct,
      explanation: exercise.explanation,
      ...(!correct && { correctAnswer: exercise.correctAnswer }),
    };
  }

  async getStats() {
    const all = await this.repo.findAll();
    return {
      totalExercises: all.count,
      totalAttempts: all.items.reduce((sum, e) => sum + (e.attemptCount || 0), 0),
      avgSuccessRate: all.count
        ? Math.round(all.items.reduce((sum, e) => sum + (e.successRate || 0), 0) / all.count)
        : 0,
    };
  }
}
