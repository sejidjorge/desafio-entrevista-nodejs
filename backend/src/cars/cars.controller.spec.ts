import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { CarsController } from "./cars.controller";
import { CarsService } from "./cars.service";
import { HttpException, HttpStatus } from "@nestjs/common";

const requestCreate = {
  brand: "VW",
  model: "Fusca",
  year: "1969",
  description: "this is a Fusca",
  auctionStart: new Date(),
  auctionEnd: new Date(),
  startBid: 5000,
  image: "https://images.pexels.com/photos/1209774/pexels-photo-1209774.jpeg",
};
const requestUpdate = {
  brand: "VW",
  model: "Fusca",
  year: "1970",
  description: "this is a Fusca",
  auctionStart: new Date(),
  auctionEnd: new Date(),
  startBid: 5000,
  image: "https://images.pexels.com/photos/1209774/pexels-photo-1209774.jpeg",
};

const expectedSingleResponse = {
  id: "1",
  brand: "VW",
  model: "Fusca",
  year: "1969",
  description: "this is a Fusca",
  auctionStart: new Date(),
  auctionEnd: new Date(),
  startBid: 5000,
  image: "https://images.pexels.com/photos/1209774/pexels-photo-1209774.jpeg",
  createdAt: new Date(),
  updatedAt: new Date(),
};

const expectedListResponse = [
  {
    id: "1",
    brand: "VW",
    model: "Fusca",
    year: "1969",
    description: "this is a Fusca",
    auctionStart: new Date(),
    auctionEnd: new Date(),
    startBid: 5000,
    image: "https://images.pexels.com/photos/1209774/pexels-photo-1209774.jpeg",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    brand: "VW",
    model: "Gol",
    year: "1969",
    description: "this is a Golf",
    auctionStart: new Date(),
    auctionEnd: new Date(),
    startBid: 1000,
    image:
      "https://images.pexels.com/photos/14577491/pexels-photo-14577491.jpeg?",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe("CarsController", () => {
  let carsController: CarsController;
  let carsService: CarsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    carsService = new CarsService(jwtService);
    carsController = new CarsController(carsService);
  });

  it("should return a created car", async () => {
    jest
      .spyOn(carsService, "createCar")
      .mockImplementation(async () => expectedSingleResponse);

    const request = {
      body: { ...requestCreate },
    } as unknown as Request;

    const newCar = await carsController.createCar(request);
    expect(newCar).toEqual(expectedSingleResponse);
  });

  it("should return a list of cars", async () => {
    jest
      .spyOn(carsService, "getCars")
      .mockImplementation(async () => expectedListResponse);

    const listCars = carsController.getCars();

    expect(listCars).toEqual(expectedListResponse);
  });

  it("should return a car by id", async () => {
    const carId = "1";
    const request = {
      params: {
        carId,
      },
    } as unknown as Request;

    jest
      .spyOn(carsService, "getCar")
      .mockImplementation(async () => expectedSingleResponse);

    const getCar = carsController.getCar(request);

    expect(getCar).toEqual(expectedSingleResponse);
  });

  it("should return a updated car", async () => {
    const carId = "1";
    const request = {
      params: {
        carId,
      },
      body: { ...requestUpdate },
    } as unknown as Request;

    jest
      .spyOn(carsService, "updateCar")
      .mockImplementation(async () => expectedSingleResponse);

    const updateCar = carsController.updateCar(request);

    expect(updateCar).toEqual(expectedSingleResponse);
  });

  it("should return a deleted car", async () => {
    const carId = "1";
    const request = {
      params: {
        carId,
      },
    } as unknown as Request;

    const expectResponse: HttpException = new HttpException(
      {
        message: "Car deleted",
        statusCode: HttpStatus.OK,
      },
      HttpStatus.OK
    );

    jest
      .spyOn(carsService, "deleteCar")
      .mockImplementation(async () => expectResponse);

    const deleteCar = carsController.deleteCar(request);

    expect(deleteCar).toEqual(expectedSingleResponse);
  });
});
