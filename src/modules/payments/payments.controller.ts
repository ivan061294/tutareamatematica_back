import { Controller, Post, Body, Get, Param, UseGuards, Request, Headers, RawBodyRequest, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout/:courseId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  createCheckout(@Param('courseId') courseId: string, @Request() req) {
    return this.paymentsService.createCheckoutSession(courseId, req.user.id, req.user.email);
  }

  @Post('webhook')
  webhook(@Req() req: RawBodyRequest<Request>, @Headers('stripe-signature') sig: string) {
    return this.paymentsService.handleWebhook(req.rawBody, sig);
  }

  @Get('verify/:sessionId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  verify(@Param('sessionId') sessionId: string) {
    return this.paymentsService.verifySession(sessionId);
  }

  @Get('orders')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  getOrders(@Request() req) {
    return this.paymentsService.getUserOrders(req.user.id);
  }
}
