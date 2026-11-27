import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Inject } from '@nestjs/common';
import { BaseDynamoRepository } from '../../../database/dynamo/base-dynamo.repository';
import { DYNAMO_CLIENT } from '../../../database/dynamo/dynamo-client.provider';
import { User } from '../entities/user.entity';

@Injectable()
export class UsersRepository extends BaseDynamoRepository<User> {
  protected readonly tableSuffix = 'users';

  constructor(
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
    config: ConfigService,
  ) {
    super(client, config);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.findOneByIndex('email-index', 'email', email);
  }
}
