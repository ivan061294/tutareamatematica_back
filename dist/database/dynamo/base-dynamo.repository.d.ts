import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { IBaseRepository, FindOptions, FindResult } from '../interfaces/base-repository.interface';
export declare abstract class BaseDynamoRepository<T extends {
    id: string;
}> implements IBaseRepository<T> {
    protected readonly client: DynamoDBDocumentClient;
    protected readonly config: ConfigService;
    protected abstract readonly tableSuffix: string;
    constructor(client: DynamoDBDocumentClient, config: ConfigService);
    protected get tableName(): string;
    findById(id: string): Promise<T | null>;
    findAll(options?: FindOptions): Promise<FindResult<T>>;
    findByIndex(indexName: string, key: string, value: any, options?: FindOptions): Promise<FindResult<T>>;
    findOneByIndex(indexName: string, key: string, value: any): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: string, data: Partial<T>): Promise<T>;
    delete(id: string): Promise<void>;
    count(): Promise<number>;
}
