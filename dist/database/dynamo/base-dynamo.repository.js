"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseDynamoRepository = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const uuid_1 = require("uuid");
const dynamo_client_provider_1 = require("./dynamo-client.provider");
let BaseDynamoRepository = class BaseDynamoRepository {
    constructor(client, config) {
        this.client = client;
        this.config = config;
    }
    get tableName() {
        const prefix = this.config.get('aws.dynamodb.tablePrefix');
        return `${prefix}-${this.tableSuffix}`;
    }
    async findById(id) {
        const result = await this.client.send(new lib_dynamodb_1.GetCommand({ TableName: this.tableName, Key: { id } }));
        return result.Item || null;
    }
    async findAll(options = {}) {
        const params = {
            TableName: this.tableName,
            Limit: options.limit || 50,
        };
        if (options.lastKey) {
            params.ExclusiveStartKey = options.lastKey;
        }
        if (options.filters) {
            const expressions = [];
            const names = {};
            const values = {};
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
        const result = await this.client.send(new lib_dynamodb_1.ScanCommand(params));
        return {
            items: result.Items || [],
            lastKey: result.LastEvaluatedKey,
            count: result.Count || 0,
        };
    }
    async findByIndex(indexName, key, value, options = {}) {
        const params = {
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
        const result = await this.client.send(new lib_dynamodb_1.QueryCommand(params));
        return {
            items: result.Items || [],
            lastKey: result.LastEvaluatedKey,
            count: result.Count || 0,
        };
    }
    async findOneByIndex(indexName, key, value) {
        const result = await this.findByIndex(indexName, key, value, { limit: 1 });
        return result.items[0] || null;
    }
    async create(data) {
        const now = new Date().toISOString();
        const entity = {
            ...data,
            id: data['id'] || (0, uuid_1.v4)(),
            createdAt: now,
            updatedAt: now,
        };
        await this.client.send(new lib_dynamodb_1.PutCommand({ TableName: this.tableName, Item: entity }));
        return entity;
    }
    async update(id, data) {
        const updateData = { ...data, updatedAt: new Date().toISOString() };
        delete updateData['id'];
        const expressions = [];
        const names = {};
        const values = {};
        Object.entries(updateData).forEach(([key, value], idx) => {
            const nameKey = `#u${idx}`;
            const valueKey = `:v${idx}`;
            names[nameKey] = key;
            values[valueKey] = value;
            expressions.push(`${nameKey} = ${valueKey}`);
        });
        const result = await this.client.send(new lib_dynamodb_1.UpdateCommand({
            TableName: this.tableName,
            Key: { id },
            UpdateExpression: `SET ${expressions.join(', ')}`,
            ExpressionAttributeNames: names,
            ExpressionAttributeValues: values,
            ReturnValues: 'ALL_NEW',
        }));
        return result.Attributes;
    }
    async delete(id) {
        await this.client.send(new lib_dynamodb_1.DeleteCommand({ TableName: this.tableName, Key: { id } }));
    }
    async count() {
        const result = await this.client.send(new lib_dynamodb_1.ScanCommand({ TableName: this.tableName, Select: 'COUNT' }));
        return result.Count || 0;
    }
};
exports.BaseDynamoRepository = BaseDynamoRepository;
exports.BaseDynamoRepository = BaseDynamoRepository = __decorate([
    __param(0, (0, common_1.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [lib_dynamodb_1.DynamoDBDocumentClient,
        config_1.ConfigService])
], BaseDynamoRepository);
//# sourceMappingURL=base-dynamo.repository.js.map