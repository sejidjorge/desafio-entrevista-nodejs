import { MiddlewareConsumer, Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthMiddleware } from "src/auth/auth.middleware";
import { AuthModule } from "src/auth/auth.module";
import { CarsController } from "./cars.controller";
import { CarsService } from "./cars.service";

@Module({
  imports: [
    AuthModule,
    JwtModule.register({ secret: process.env.PRIVATE_KEY }),
  ],
  controllers: [CarsController],
  providers: [CarsService],
})
export class CarsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes(CarsController);
  }
}
