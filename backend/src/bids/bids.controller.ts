import { Controller, Get, Post, Req } from "@nestjs/common";
import { BidsService } from "./bids.service";
import { Request } from 'express';

@Controller("bids")
export class BidsController {
  constructor(private readonly bidsService: BidsService) {}

  @Post()
  async createBid(@Req() request: Request) {
    return this.bidsService.createBid(request.body, request.headers);
  }

  @Get()
  async getBidsByUser(@Req() request: Request) {
    return this.bidsService.getBidsByUser(request.headers);
  }

  @Get('all')
  async getBidsAllUsers(@Req() request: Request) {
    return this.bidsService.getBidsAllUsers(request.headers);
  }
}
