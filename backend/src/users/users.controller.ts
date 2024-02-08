import { Controller, Delete, Get, Post, Put, Req } from "@nestjs/common";
import { UsersService } from "./users.service";
import { Request } from "express";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post("register")
  async createUser(@Req() request: Request) {
    return await this.usersService.createUser(request.body);
  }

  @Post("login")
  async loginUser(@Req() request: Request) {
    return await this.usersService.loginUser(request.body);
  }

  @Get("list")
  async getUsers() {
    return await this.usersService.getUsers();
  }

  @Get(":userId")
  async getUser(@Req() request: Request) {
    const { userId } = request.params;
    return await this.usersService.getUser(userId, request.headers);
  }

  @Put(":userId")
  async updateUser(@Req() request: Request) {
    const { userId } = request.params;
    const { body, headers } = request;
    return await this.usersService.updateUser(userId, body, headers);
  }

  @Delete(":userId")
  async deleteUser(@Req() request: Request) {
    const { userId } = request.params;
    return await this.usersService.deleteUser(userId, request.headers);
  }

}
