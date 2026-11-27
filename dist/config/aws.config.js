"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('aws', () => ({
    region: process.env.AWS_REGION || 'us-east-1',
    dynamodb: {
        tablePrefix: process.env.DYNAMODB_TABLE_PREFIX || 'mathpro-api-dev',
        endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
    },
    s3: {
        bucket: process.env.S3_BUCKET || 'mathpro-api-files-dev',
        urlExpiration: parseInt(process.env.S3_URL_EXPIRATION, 10) || 3600,
        endpoint: process.env.S3_ENDPOINT || undefined,
    },
}));
//# sourceMappingURL=aws.config.js.map