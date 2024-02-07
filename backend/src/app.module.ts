import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./users/users.module";
import { BidsModule } from "./bids/bids.module";
import { CarsModule } from "./cars/cars.module";
import { ReportsModule } from "./reports/reports.module";
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [BidsModule, CarsModule, ReportsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
