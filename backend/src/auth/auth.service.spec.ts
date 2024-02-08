import { JwtService } from "@nestjs/jwt";
import { $Enums } from "@prisma/client";
import { AuthService } from "./auth.service";
import { NextFunction, Request, Response } from "express";

export class User {
  id: string;
  email: string;
  name: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
}

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jwtService = new JwtService();
    service = new AuthService(jwtService);
  });

  it("should return a token", async () => {
    const user: User = {
      id: "123e4567-e89b-12d3-a456-426614174000",
      name: "John Doe",
      email: "johndoe@email.com",
      role: "USER",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const token = "token";

    jest.spyOn(service, "generateToken").mockImplementation(async () => token);

    const actualUser = await service.generateToken(user);

    expect(actualUser).toEqual(token);
  });
});
