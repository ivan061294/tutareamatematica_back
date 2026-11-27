import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export const DYNAMO_CLIENT = 'DYNAMO_CLIENT';

export const DynamoClientProvider: Provider = {
  provide: DYNAMO_CLIENT,
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const endpoint = config.get<string>('aws.dynamodb.endpoint');
    const region = config.get<string>('aws.region');

    const client = new DynamoDBClient({
      region,
      ...(endpoint ? { endpoint } : {}),
    });

    return DynamoDBDocumentClient.from(client, {
      marshallOptions: { removeUndefinedValues: true },
    });
  },
};
