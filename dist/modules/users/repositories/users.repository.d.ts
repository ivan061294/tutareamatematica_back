import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BaseDynamoRepository } from '../../../database/dynamo/base-dynamo.repository';
import { User } from '../entities/user.entity';
export declare class UsersRepository extends BaseDynamoRepository<User> {
    protected readonly tableSuffix = "users";
    constructor(client: DynamoDBDocumentClient, config: ConfigService);
    findByEmail(email: string): Promise<User | null>;
}
