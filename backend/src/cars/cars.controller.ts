import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { CarsService } from "./cars.service";
import { Request } from "express";

@Controller("cars")
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post("new")
  async createCar(@Req() resquest: Request) {
    return await this.carsService.createCar(resquest.body, resquest.headers);
  }

  @Get("list")
  async getCars() {
    return await this.carsService.getCars();
  }

  @Get(":carId")
  async getCar(@Req() resquest: Request) {
    const { carId } = resquest.params;
    return await this.carsService.getCar(carId);
  }

  @Put(":carId")
  async updateCar(@Req() resquest: Request) {
    const { carId } = resquest.params;
    return this.carsService.updateCar(carId, resquest.body, resquest.headers);
  }

  @Delete(":carId")
  async deleteCar(@Req() resquest: Request) {
    const { carId } = resquest.params;
    return await this.carsService.deleteCar(carId, resquest.headers);
  }
}
