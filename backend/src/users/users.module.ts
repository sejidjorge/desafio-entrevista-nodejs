import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthModule } from "src/auth/auth.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "src/auth/auth.service";

@Module({
  imports: [
    AuthModule,
    JwtModule.register({ secret: process.env.PRIVATE_KEY }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {
  constructor(private readonly authService: AuthService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.authService.validateSession)
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