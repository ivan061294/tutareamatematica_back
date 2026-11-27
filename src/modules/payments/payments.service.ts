import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { BaseDynamoRepository } from '../../database/dynamo/base-dynamo.repository';
import { DYNAMO_CLIENT } from '../../database/dynamo/dynamo-client.provider';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';

class Order {
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

class OrdersRepository extends BaseDynamoRepository<Order> {
  protected readonly tableSuffix = 'orders';
  constructor(
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
    config: ConfigService,
  ) { super(client, config); }

  findByUser(userId: string) {
    return this.findByIndex('userId-index', 'userId', userId);
  }
}

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly ordersRepo: OrdersRepository;

  constructor(
    private readonly config: ConfigService,
    private readonly coursesService: CoursesService,
    private readonly usersService: UsersService,
    @Inject(DYNAMO_CLIENT) client: DynamoDBDocumentClient,
  ) {
    this.stripe = new Stripe(config.get<string>('stripe.secretKey'), {
      apiVersion: '2024-04-10',
    });
    this.ordersRepo = new OrdersRepository(client, config);
  }

  async createCheckoutSession(courseId: string, userId: string, userEmail: string) {
    const course = await this.coursesService.findById(courseId);
    const frontendUrl = this.config.get<string>('app.frontendUrl');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: userEmail,
      line_items: [
        {
          price_data: {
            currency: this.config.get<string>('stripe.currency'),
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
      currency: this.config.get<string>('stripe.currency'),
      status: 'pending',
      stripeSessionId: session.id,
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.config.get<string>('stripe.webhookSecret');
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
    } catch {
      throw new BadRequestException('Webhook inválido');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const { courseId, userId } = session.metadata;

      const orders = await this.ordersRepo.findAll({ filters: { stripeSessionId: session.id } });
      if (orders.items.length) {
        await this.ordersRepo.update(orders.items[0].id, {
          status: 'completed',
          stripePaymentIntentId: session.payment_intent as string,
        });
      }

      await this.usersService.enrollInCourse(userId, courseId);
      await this.coursesService.incrementStudentCount(courseId);
    }

    return { received: true };
  }

  async verifySession(sessionId: string) {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId);
    return {
      status: session.payment_status,
      courseId: session.metadata?.courseId,
    };
  }

  async getUserOrders(userId: string) {
    return this.ordersRepo.findByUser(userId);
  }
}
