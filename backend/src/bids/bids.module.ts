import { MiddlewareConsumer, Module } from "@nestjs/common";
import { BidsController } from "./bids.controller";
import { BidsService } from "./bids.service";
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({  imports: [
    AuthModule,
    JwtModule.register({ secret: process.env.PRIVATE_KEY }),
  ],
	controllers: [BidsController],
	providers: [BidsService],
})
export class BidsModule {constructor(private readonly authService: AuthService) {}

configure(consumer: MiddlewareConsumer) {
  consumer
	.apply(this.authService.validateSession)
	.forRoutes(BidsController);
}}
