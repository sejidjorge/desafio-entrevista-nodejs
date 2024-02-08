import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { prisma } from "../prisma";
export class ReportData {
  total_users: number;
  total_cars: number;
  total_bids: number;
  total_purchases: number;
}

@Injectable()
export class ReportsService {
  async getReports(): Promise<ReportData> {
    try {
      const users = await prisma.users.count();
      const cars = await prisma.cars.count();
      const bids = await prisma.bids.count();
      const purchases = await prisma.purchases.count();

      const requests = await Promise.all([users, cars, bids, purchases]);
      return {
        total_users: requests[0],
        total_cars: requests[1],
        total_bids: requests[2],
        total_purchases: requests[3],
      };
    } catch (error) {
      throw new HttpException(
        {
          message: "Error get reports",
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
