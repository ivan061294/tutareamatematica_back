import { RawBodyRequest } from '@nestjs/common';
import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createCheckout(courseId: string, req: any): Promise<{
        sessionId: string;
        url: string;
    }>;
    webhook(req: RawBodyRequest<Request>, sig: string): Promise<{
        received: boolean;
    }>;
    verify(sessionId: string): Promise<{
        status: import("stripe").Stripe.Checkout.Session.PaymentStatus;
        courseId: string;
    }>;
    getOrders(req: any): Promise<import("../../database/interfaces/base-repository.interface").FindResult<{
        id: string;
        userId: string;
        courseId: string;
        amount: number;
        currency: string;
        status: "pending" | "completed" | "failed" | "refunded";
        stripeSessionId?: string;
        stripePaymentIntentId?: string;
        createdAt: string;
        updatedAt: string;
    }>>;
}
