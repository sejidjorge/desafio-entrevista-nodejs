import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { BidsController } from "./bids.controller";
import { BidsService } from "./bids.service";

const singleBid = {
  id: "1",
  bidValue: 100,
  carId: "1",
  userId: "1",
  createdAt: new Date(),
  car: {
    brand: "VW",
    model: "Fusca",
    year: "1969",
    description: "this is a Fusca",
    startBid: 50,
    status: "OPEN",
  },
};

describe("BidsController", () => {
  let controller: BidsController;
  let service: BidsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    service = new BidsService(jwtService);
    controller = new BidsController(service);
  });

  it("should create a new bid", async () => {
    const body = {
      bidValue: 100,
      carId: "1",
    };

    const req = { body: body } as unknown as Request;
    jest.spyOn(service, "createBid").mockImplementation(async () => singleBid);

    const actualUser = await controller.createBid(req);

    expect(actualUser).toEqual(singleBid);
  });

  it("should user bids", async () => {
    const req = { user: { id: "1" } } as unknown as Request;
    jest
      .spyOn(service, "getBidsByUser")
      .mockImplementation(async () => [singleBid]);

    const bidsByUser = await controller.getBidsByUser(req);
    expect(bidsByUser).toEqual([singleBid]);
  });

  it("should all users bids", async () => {
    const req = { headers: { authorization: "token" } } as unknown as Request;
    jest
      .spyOn(service, "getBidsAllUsers")
      .mockImplementation(async () => [singleBid]);

    const bidsByUser = await controller.getBidsAllUsers(req);
    expect(bidsByUser).toEqual([singleBid]);
  });
});
