import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthMiddleware } from "src/auth/auth.middleware";
import { AuthModule } from "src/auth/auth.module";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

@Module({
  imports: [
    AuthModule,
    JwtModule.register({ secret: process.env.PRIVATE_KEY }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: "users/register", method: RequestMethod.POST },
        { path: "users/login", method: RequestMethod.POST }
      )
      .forRoutes(UsersController);
  }
}

//   users/register
//   users/list
//   users/:id update
//   users/:id get data
//   users/id delete
