"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoClientProvider = exports.DYNAMO_CLIENT = void 0;
const config_1 = require("@nestjs/config");
const client_dynamodb_1 = require("@aws-sdk/client-dynamodb");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
exports.DYNAMO_CLIENT = 'DYNAMO_CLIENT';
exports.DynamoClientProvider = {
    provide: exports.DYNAMO_CLIENT,
    inject: [config_1.ConfigService],
    useFactory: (config) => {
        const endpoint = config.get('aws.dynamodb.endpoint');
        const region = config.get('aws.region');
        const client = new client_dynamodb_1.DynamoDBClient({
            region,
            ...(endpoint ? { endpoint } : {}),
        });
        return lib_dynamodb_1.DynamoDBDocumentClient.from(client, {
            marshallOptions: { removeUndefinedValues: true },
        });
    },
};
//# sourceMappingURL=dynamo-client.provider.js.map