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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const stripe_1 = require("stripe");
const lib_dynamodb_1 = require("@aws-sdk/lib-dynamodb");
const base_dynamo_repository_1 = require("../../database/dynamo/base-dynamo.repository");
const dynamo_client_provider_1 = require("../../database/dynamo/dynamo-client.provider");
const courses_service_1 = require("../courses/courses.service");
const users_service_1 = require("../users/users.service");
class Order {
}
let OrdersRepository = class OrdersRepository extends base_dynamo_repository_1.BaseDynamoRepository {
    constructor(client, config) {
        super(client, config);
        this.tableSuffix = 'orders';
    }
    findByUser(userId) {
        return this.findByIndex('userId-index', 'userId', userId);
    }
};
OrdersRepository = __decorate([
    __param(0, (0, common_1.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [lib_dynamodb_1.DynamoDBDocumentClient,
        config_1.ConfigService])
], OrdersRepository);
let PaymentsService = class PaymentsService {
    constructor(config, coursesService, usersService, client) {
        this.config = config;
        this.coursesService = coursesService;
        this.usersService = usersService;
        this.stripe = new stripe_1.default(config.get('stripe.secretKey'), {
            apiVersion: '2024-04-10',
        });
        this.ordersRepo = new OrdersRepository(client, config);
    }
    async createCheckoutSession(courseId, userId, userEmail) {
        const course = await this.coursesService.findById(courseId);
        const frontendUrl = this.config.get('app.frontendUrl');
        const session = await this.stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            customer_email: userEmail,
            line_items: [
                {
                    price_data: {
                        currency: this.config.get('stripe.currency'),
                        product_data: {
                            name: course.title,
                            description: course.shortDescription,
                            images: course.thumbnailUrl ? [course.thumbnailUrl] : [],
                        },
                        unit_amount: Math.round(course.price * 100),
                    },
                    quantity: 1,
                },
            ],
            metadata: { courseId, userId },
            success_url: `${frontendUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/courses/${course.slug}`,
        });
        await this.ordersRepo.create({
            userId,
            courseId,
            amount: course.price,
            currency: this.config.get('stripe.currency'),
            status: 'pending',
            stripeSessionId: session.id,
        });
        return { sessionId: session.id, url: session.url };
    }
    async handleWebhook(rawBody, signature) {
        const webhookSecret = this.config.get('stripe.webhookSecret');
        let event;
        try {
            event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
        }
        catch {
            throw new common_1.BadRequestException('Webhook inválido');
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const { courseId, userId } = session.metadata;
            const orders = await this.ordersRepo.findAll({ filters: { stripeSessionId: session.id } });
            if (orders.items.length) {
                await this.ordersRepo.update(orders.items[0].id, {
                    status: 'completed',
                    stripePaymentIntentId: session.payment_intent,
                });
            }
            await this.usersService.enrollInCourse(userId, courseId);
            await this.coursesService.incrementStudentCount(courseId);
        }
        return { received: true };
    }
    async verifySession(sessionId) {
        const session = await this.stripe.checkout.sessions.retrieve(sessionId);
        return {
            status: session.payment_status,
            courseId: session.metadata?.courseId,
        };
    }
    async getUserOrders(userId) {
        return this.ordersRepo.findByUser(userId);
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(3, (0, common_1.Inject)(dynamo_client_provider_1.DYNAMO_CLIENT)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        courses_service_1.CoursesService,
        users_service_1.UsersService,
        lib_dynamodb_1.DynamoDBDocumentClient])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map