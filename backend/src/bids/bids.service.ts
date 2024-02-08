import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { prisma } from "../prisma";

export class NewBid {
  bidValue: number;
  carId: string;
}

export class ReturnBid {
  id: string;
  bidValue: number;
  carId: string;
  userId: string;
  createdAt: Date;
  car: {
    brand: string;
    model: string;
    year: string;
    description: string;
    startBid: number;
    status: string;
  };
}
@Injectable()
export class BidsService {
  constructor(private readonly jwtService: JwtService) {}

  async createBid(data: NewBid, header): Promise<ReturnBid> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = header["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    try {
      const newBid = await prisma.bids.create({
        data: {
          bidValue: data.bidValue,
          carId: data.carId,
          userId: tokenDecoded.id,
        },
        select: {
          id: true,
          bidValue: true,
          carId: true,
          userId: true,
          createdAt: true,
          car: {
            select: {
              brand: true,
              model: true,
              year: true,
              description: true,
              startBid: true,
              status: true,
            },
          },
        },
      });
      return newBid;
    } catch (error) {
      throw new HttpException(
        {
          message: "Error creating bid",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getBidsByUser(header): Promise<ReturnBid[]> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = header["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    try {
      const bidsByUser = await prisma.bids.findMany({
        where: { userId: tokenDecoded.id },
        select: {
          id: true,
          bidValue: true,
          carId: true,
          userId: true,
          createdAt: true,
          car: {
            select: {
              brand: true,
              model: true,
              year: true,
              description: true,
              startBid: true,
              status: true,
            },
          },
        },
      });
      return bidsByUser;
    } catch (error) {
      throw new HttpException(
        {
          message: "Error geting bid",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getBidsAllUsers(header) {
    try {
      return [];
    } catch (error) {
      throw new HttpException(
        {
          message: "Error geting bid",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
