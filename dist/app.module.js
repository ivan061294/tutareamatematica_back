"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const courses_module_1 = require("./modules/courses/courses.module");
const exercises_module_1 = require("./modules/exercises/exercises.module");
const videos_module_1 = require("./modules/videos/videos.module");
const payments_module_1 = require("./modules/payments/payments.module");
const files_module_1 = require("./modules/files/files.module");
const database_module_1 = require("./database/database.module");
const app_config_1 = require("./config/app.config");
const aws_config_1 = require("./config/aws.config");
const stripe_config_1 = require("./config/stripe.config");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [app_config_1.default, aws_config_1.default, stripe_config_1.default],
                envFilePath: ['.env.local', '.env'],
            }),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            courses_module_1.CoursesModule,
            exercises_module_1.ExercisesModule,
            videos_module_1.VideosModule,
            payments_module_1.PaymentsModule,
            files_module_1.FilesModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map