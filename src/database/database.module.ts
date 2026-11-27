import { Global, Module } from '@nestjs/common';
import { DynamoClientProvider } from './dynamo/dynamo-client.provider';

@Global()
@Module({
  providers: [DynamoClientProvider],
  exports: [DynamoClientProvider],
})
export class DatabaseModule {}
