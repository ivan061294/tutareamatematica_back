import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { CoursesModule } from './modules/courses/courses.module';
import { ExercisesModule } from './modules/exercises/exercises.module';
import { VideosModule } from './modules/videos/videos.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { FilesModule } from './modules/files/files.module';
import { DatabaseModule } from './database/database.module';
import appConfig from './config/app.config';
import awsConfig from './config/aws.config';
import stripeConfig from './config/stripe.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, awsConfig, stripeConfig],
      envFilePath: ['.env.local', '.env'],
    }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    CoursesModule,
    ExercisesModule,
    VideosModule,
    PaymentsModule,
    FilesModule,
  ],
})
export class AppModule {}
