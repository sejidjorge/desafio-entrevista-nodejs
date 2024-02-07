import { JwtService } from "@nestjs/jwt";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { AuthService } from "src/auth/auth.service";
import { $Enums } from "@prisma/client";
import { Request } from "express";
import { HttpException, HttpStatus } from "@nestjs/common";

export class User {
  id: string;
  email: string;
  name: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
}

export class DataLogin {
  token: string;
  user: User;
}

describe("UsersController", () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let jwtService: JwtService;
  let authService: AuthService;
  beforeEach(() => {
    usersService = new UsersService(jwtService, authService);
    usersController = new UsersController(usersService);
  });

  it("should return a created user", async () => {
    const request = {
      body: {
        name: "John Doe",
        email: "johndoe@email.com",
        password: "password",
      },
    } as unknown as Request;
    const expected = new HttpException(
      {
        message: "Successfully registered user.",
        statusCode: HttpStatus.OK,
      },
      HttpStatus.OK
    );

    jest
      .spyOn(usersService, "createUser")
      .mockImplementation(async () => expected);

    const actualUser = await usersController.createUser(request);

    expect(actualUser).toEqual(expected);
  });

  it("should return a user and access token", async () => {
    const request = {
      body: {
        email: "johndoe@email.com",
        password: "password",
      },
    } as unknown as Request;
    const expectedResponse: DataLogin = {
      user: {
        id: "123e4567-e89b-12d3-a456-426614174000",
        name: "John Doe",
        email: "johndoe@email.com",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      token: "token",
    };

    jest
      .spyOn(usersService, "loginUser")
      .mockImplementation(async () => expectedResponse);

    const actualResponse = await usersController.loginUser(request);

    expect(actualResponse).toEqual(expectedResponse);
  });

  it("should return a list of users", async () => {
    const expectedUsers: User[] = [
      {
        id: "1",
        name: "John Doe",
        email: "johndoe@email.com",
        role: "USER",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Jane Doe",
        email: "janedoe@email.com",
        role: "ADMIN",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    jest
      .spyOn(usersService, "getUsers")
      .mockImplementation(async () => expectedUsers);

    const actualUsers = await usersController.getUsers();

    expect(actualUsers).toEqual(expectedUsers);
  });

  it("should return a user", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const expectedUser: User = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John Doe",
      email: "johndoe@email.com",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const request = {
      params: {
        userId,
      },
    } as unknown as Request;

    jest
      .spyOn(usersService, "getUser")
      .mockImplementation(async () => expectedUser);

    const actualUser = await usersController.getUser(request);

    expect(actualUser).toEqual(expectedUser);
  });

  it("should return an updated user", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const request = {
      body: {
        name: "John Doe",
        role: "ADMIN",
      },
      params: {
        userId,
      },
    } as unknown as Request;
    const expectedUser: User = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John Doe",
      email: "johndoe@email.com",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    jest
      .spyOn(usersService, "updateUser")
      .mockImplementation(async () => expectedUser);

    const actualUser = await usersController.updateUser(request);

    expect(actualUser).toEqual(expectedUser);
  });

  it("should return a deleted user", async () => {
    const userId = "123e4567-e89b-12d3-a456-426614174000";
    const request = {
      params: {
        userId,
      },
    } as unknown as Request;

    const expected = new HttpException(
      {
        message: "user successfully deleted",
        statusCode: HttpStatus.OK,
      },
      HttpStatus.OK
    );

    jest
      .spyOn(usersService, "deleteUser")
      .mockImplementation(async () => expected);

    const actualMessage = await usersController.deleteUser(request);

    expect(actualMessage).toEqual(expected);
  });
});
