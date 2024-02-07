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

  it("should allow valid token", async () => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHQiOjE3MDczMzgzNjB9.f3vxA6yQjrThL_JxNp9HdMAZaVkqAvvUfvUEKqnj_1o";
    const req = { headers: { authorization: token } } as unknown as Request;
    const res = {} as unknown as Response;
    const next = jest.fn();

    await service.validateSession(req, res, next);

    expect(jwtService.verify).toHaveBeenCalledWith(token);
    expect(next).toHaveBeenCalled();
  });
});
