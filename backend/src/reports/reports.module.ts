import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ReportsController } from "./reports.controller";
import { ReportsService } from "./reports.service";
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({  imports: [
    AuthModule,
    JwtModule.register({ secret: process.env.PRIVATE_KEY }),
  ],
	controllers: [ReportsController],
	providers: [ReportsService],
})
export class ReportsModule {constructor(private readonly authService: AuthService) {}

configure(consumer: MiddlewareConsumer) {
  consumer
	.apply(this.authService.validateSession)
	.forRoutes(ReportsController);
}}
