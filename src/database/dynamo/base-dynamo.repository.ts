import { Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { v4 as uuidv4 } from 'uuid';
import { DYNAMO_CLIENT } from './dynamo-client.provider';
import { IBaseRepository, FindOptions, FindResult } from '../interfaces/base-repository.interface';

export abstract class BaseDynamoRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected abstract readonly tableSuffix: string;

  constructor(
    @Inject(DYNAMO_CLIENT) protected readonly client: DynamoDBDocumentClient,
    protected readonly config: ConfigService,
  ) {}

  protected get tableName(): string {
    const prefix = this.config.get<string>('aws.dynamodb.tablePrefix');
    return `${prefix}-${this.tableSuffix}`;
  }

  async findById(id: string): Promise<T | null> {
    const result = await this.client.send(
      new GetCommand({ TableName: this.tableName, Key: { id } }),
    );
    return (result.Item as T) || null;
  }

  async findAll(options: FindOptions = {}): Promise<FindResult<T>> {
    const params: any = {
      TableName: this.tableName,
      Limit: options.limit || 50,
    };

    if (options.lastKey) {
      params.ExclusiveStartKey = options.lastKey;
    }

    if (options.filters) {
      const expressions: string[] = [];
      const names: Record<string, string> = {};
      const values: Record<string, any> = {};

      Object.entries(options.filters).forEach(([key, value], idx) => {
        const nameKey = `#f${idx}`;
        const valueKey = `:v${idx}`;
        names[nameKey] = key;
        values[valueKey] = value;
        expressions.push(`${nameKey} = ${valueKey}`);
      });

      params.FilterExpression = expressions.join(' AND ');
      params.ExpressionAttributeNames = names;
      params.ExpressionAttributeValues = values;
    }

    const result = await this.client.send(new ScanCommand(params));
    return {
      items: (result.Items as T[]) || [],
      lastKey: result.LastEvaluatedKey,
      count: result.Count || 0,
    };
  }

  async findByIndex(
    indexName: string,
    key: string,
    value: any,
    options: FindOptions = {},
  ): Promise<FindResult<T>> {
    const params: any = {
      TableName: this.tableName,
      IndexName: indexName,
      KeyConditionExpression: '#k = :v',
      ExpressionAttributeNames: { '#k': key },
      ExpressionAttributeValues: { ':v': value },
      Limit: options.limit || 50,
    };

    if (options.lastKey) {
      params.ExclusiveStartKey = options.lastKey;
    }

    const result = await this.client.send(new QueryCommand(params));
    return {
      items: (result.Items as T[]) || [],
      lastKey: result.LastEvaluatedKey,
      count: result.Count || 0,
    };
  }

  async findOneByIndex(indexName: string, key: string, value: any): Promise<T | null> {
    const result = await this.findByIndex(indexName, key, value, { limit: 1 });
    return result.items[0] || null;
  }

  async create(data: Partial<T>): Promise<T> {
    const now = new Date().toISOString();
    const entity = {
      ...data,
      id: data['id'] || uuidv4(),
      createdAt: now,
      updatedAt: now,
    } as unknown as T;

    await this.client.send(new PutCommand({ TableName: this.tableName, Item: entity }));
    return entity;
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const updateData = { ...data, updatedAt: new Date().toISOString() };
    delete updateData['id'];

    const expressions: string[] = [];
    const names: Record<string, string> = {};
    const values: Record<string, any> = {};

    Object.entries(updateData).forEach(([key, value], idx) => {
      const nameKey = `#u${idx}`;
      const valueKey = `:v${idx}`;
      names[nameKey] = key;
      values[valueKey] = value;
      expressions.push(`${nameKey} = ${valueKey}`);
    });

    const result = await this.client.send(
      new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${expressions.join(', ')}`,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values,
        ReturnValues: 'ALL_NEW',
      }),
    );

    return result.Attributes as T;
  }

  async delete(id: string): Promise<void> {
    await this.client.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }

  async count(): Promise<number> {
    const result = await this.client.send(
      new ScanCommand({ TableName: this.tableName, Select: 'COUNT' }),
    );
    return result.Count || 0;
  }
}
