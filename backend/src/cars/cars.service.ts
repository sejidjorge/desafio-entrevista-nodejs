import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { prisma } from "../prisma";
export class NewCar {
  brand: string;
  model: string;
  year: string;
  auctionStart: Date;
  auctionEnd: Date;
  startBid: number;
  image: string;
  description: string;
}

export class ReturnCar {
  id: string;
  brand: string;
  model: string;
  year: string;
  description: string;
  auctionStart: Date;
  auctionEnd: Date;
  startBid: number;
  createdAt: Date;
  updatedAt: Date;
}
@Injectable()
export class CarsService {
  constructor(private readonly jwtService: JwtService) {}

  async createCar(car: NewCar, headers): Promise<ReturnCar> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = headers["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    if (tokenDecoded.role !== "ADMIN") {
      throw new HttpException(
        {
          message:
            "Unauthorized, only admins can create, edit or delete vehicles.",
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const required = [
      "brand",
      "model",
      "year",
      "auctionStart",
      "auctionEnd",
      "startBid",
    ];

    try {
      for (const field of required) {
        if (!car[field]) {
          throw new Error(`${field} is required`);
        }
      }
      const newCar = await prisma.cars.create({
        data: { ...car },
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          auctionStart: true,
          auctionEnd: true,
          startBid: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          description: true,
        },
      });
      return newCar;
    } catch (error) {
      if (error.includes("is required")) {
        throw new HttpException(
          {
            message: error,
            statusCode: HttpStatus.BAD_REQUEST,
          },
          HttpStatus.BAD_REQUEST
        );
      }
      throw new HttpException(
        {
          message: "Error creating car",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getCars(): Promise<ReturnCar[]> {
    try {
      const cars = await prisma.cars.findMany({
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          auctionStart: true,
          auctionEnd: true,
          startBid: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          description: true,
        },
      });
      return cars;
    } catch (error) {
      throw new HttpException(
        {
          message: "Error getting cars",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getCar(id: string) {
    try {
      const car = await prisma.cars.findUnique({
        where: {
          id: id,
        },
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          auctionStart: true,
          auctionEnd: true,
          startBid: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          description: true,
        },
      });
      return car;
    } catch (error) {
      throw new HttpException(
        {
          message: "Error getting cars",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateCar(id: string, car: NewCar, headers): Promise<ReturnCar> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = headers["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    if (tokenDecoded.role !== "ADMIN") {
      throw new HttpException(
        {
          message:
            "Unauthorized, only admins can create, edit or delete vehicles.",
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    const verifyCar = await prisma.cars.findUnique({
      where: {
        id: id,
      },
    });
    if (!verifyCar) {
      throw new HttpException(
        {
          message: "Car not found",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }

    try {
      const updatedCar = await prisma.cars.update({
        where: {
          id: id,
        },
        data: { ...car, updatedAt: new Date() },
        select: {
          id: true,
          brand: true,
          model: true,
          year: true,
          auctionStart: true,
          auctionEnd: true,
          startBid: true,
          createdAt: true,
          updatedAt: true,
          image: true,
          description: true,
        },
      });
      return updatedCar;
    } catch (error) {
      throw new HttpException(
        {
          message: "Error getting cars",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async deleteCar(id: string, headers): Promise<HttpException> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = headers["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    if (tokenDecoded.role !== "ADMIN") {
      throw new HttpException(
        {
          message:
            "Unauthorized, only admins can create, edit or delete vehicles.",
          status: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.UNAUTHORIZED
      );
    }

    try {
      await prisma.cars.delete({
        where: {
          id: id,
        },
      });
      throw new HttpException(
        {
          message: "Car deleted",
          statusCode: HttpStatus.OK,
        },
        HttpStatus.OK
      );
    } catch (error) {
      throw new HttpException(
        {
          message: "Error deleting car",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
