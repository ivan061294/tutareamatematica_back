import { registerAs } from '@nestjs/config';

export default registerAs('aws', () => ({
  region: process.env.AWS_REGION || 'us-east-1',
  dynamodb: {
    tablePrefix: process.env.DYNAMODB_TABLE_PREFIX || 'mathpro-api-dev',
    endpoint: process.env.DYNAMODB_ENDPOINT || undefined, // Para local con DynamoDB Local
  },
  s3: {
    bucket: process.env.S3_BUCKET || 'mathpro-api-files-dev',
    urlExpiration: parseInt(process.env.S3_URL_EXPIRATION, 10) || 3600,
    endpoint: process.env.S3_ENDPOINT || undefined,
  },
}));
