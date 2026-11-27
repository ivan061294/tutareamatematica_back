import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { CoursesModule } from '../courses/courses.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [CoursesModule, UsersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
