import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
declare class Order {
    id: string;
    userId: string;
    courseId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed' | 'refunded';
    stripeSessionId?: string;
    stripePaymentIntentId?: string;
    createdAt: string;
    updatedAt: string;
}
export declare class PaymentsService {
    private readonly config;
    private readonly coursesService;
    private readonly usersService;
    private stripe;
    private readonly ordersRepo;
    constructor(config: ConfigService, coursesService: CoursesService, usersService: UsersService, client: DynamoDBDocumentClient);
    createCheckoutSession(courseId: string, userId: string, userEmail: string): Promise<{
        sessionId: string;
        url: string;
    }>;
    handleWebhook(rawBody: Buffer, signature: string): Promise<{
        received: boolean;
    }>;
    verifySession(sessionId: string): Promise<{
        status: Stripe.Checkout.Session.PaymentStatus;
        courseId: string;
    }>;
    getUserOrders(userId: string): Promise<import("../../database/interfaces/base-repository.interface").FindResult<Order>>;
}
export {};
