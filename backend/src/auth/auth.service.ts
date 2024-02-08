import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { $Enums } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

export class User {
  id: string;
  email: string;
  name: string;
  role: $Enums.Role;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}
  async generateToken(user: User) {
    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 2,
      iat: Math.floor(Date.now() / 1000),
    };
    const token = await this.jwtService.sign(payload);
    return token;
  }
  async validateSession(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = request.headers["authorization"].slice(7);

    if (token) {
      try {
        const decoded = await this.jwtService.verify(token);
        const current = Math.floor(Date.now() / 1000);
        const expiredToken = current >= decoded.exp;
        if (expiredToken) {
          throw new HttpException(
            {
              message: "Expired token",
              statusCode: HttpStatus.UNAUTHORIZED,
            },
            HttpStatus.BAD_REQUEST
          );
        }
        next();
      } catch (error) {
        throw new HttpException(
          {
            message: "Unauthorized",
            statusCode: HttpStatus.UNAUTHORIZED,
          },
          HttpStatus.BAD_REQUEST
        );
      }
    } else {
      throw new HttpException(
        {
          message: "Unauthorized",
          statusCode: HttpStatus.UNAUTHORIZED,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
