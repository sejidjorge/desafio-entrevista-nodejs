import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { $Enums } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { AuthService } from "../auth/auth.service";
import { prisma } from "../prisma";

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

export class updateUser {
  name: string;
  role: $Enums.Role;
}
@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  async createUser(body): Promise<HttpException> {
    const required = ["name", "email", "password"];

    try {
      for (const field of required) {
        if (!body[field]) {
          throw new HttpException(
            {
              message: `${field} is required`,
              statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST
          );
        }
      }

      const passwordHash = await bcrypt.hash(body.password, 10);

      await prisma.users.create({
        data: {
          name: body.name,
          email: body.email,
          passwordHash,
        },
        select: {
          id: true,
          email: true,
          name: true,
        },
      });
      throw new HttpException(
        {
          message: "Successfully registered user.",
          statusCode: HttpStatus.OK,
        },
        HttpStatus.OK
      );
    } catch (error) {
      if (error?.meta?.target === "Users_email_key") {
        throw new HttpException(
          {
            message: "User email already exists",
            statusCode: HttpStatus.CONFLICT,
          },
          HttpStatus.CONFLICT
        );
      }
      throw new HttpException(
        {
          message: "Error creating user",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async loginUser(body): Promise<DataLogin> {
    const required = ["email", "password"];

    try {
      for (const field of required) {
        if (!body[field]) {
          throw new HttpException(
            {
              message: `${field} is required`,
              statusCode: HttpStatus.BAD_REQUEST,
            },
            HttpStatus.BAD_REQUEST
          );
        }
      }

      const user = await prisma.users.findUnique({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        throw new Error("User not found");
      }

      const isPasswordValid = await bcrypt.compare(
        body.password,
        user.passwordHash
      );

      if (!isPasswordValid) {
        throw new Error("Invalid password");
      }
      const token = await this.authService.generateToken(user);

      const formatedUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
      return { user: formatedUser, token };
    } catch (error) {
      console.log(error);

      throw new HttpException(
        {
          message: "Error logging in",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async getUsers(): Promise<User[]> {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        passwordHash: false,
        createdAt: true,
        updatedAt: true,
      },
    });

    return users;
  }

  async getUser(id: string, header): Promise<User> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = header["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    if (tokenDecoded.id !== id && tokenDecoded.role !== "ADMIN") {
      throw new HttpException(
        {
          message: "You cannot edit other users' data",
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const user = await prisma.users.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          passwordHash: false,
        },
      });
      return user;
    } catch (error) {
      throw new HttpException(
        {
          message: "Error getting user",
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async updateUser(id: string, body, header): Promise<User> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = header["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    const updatedBody = { ...body };

    if (tokenDecoded.id !== id && tokenDecoded.role !== "ADMIN") {
      throw new HttpException(
        {
          message: "You cannot edit other users' data",
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      const update = await prisma.users.update({
        where: {
          id,
        },
        data: { ...updatedBody, updatedAt: new Date() },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return update;
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }

  async deleteUser(id: string, headers): Promise<HttpException> {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = headers["authorization"].slice(7);
    const tokenDecoded = await this.jwtService.verify(token);
    if (tokenDecoded.id !== id && tokenDecoded.role !== "ADMIN") {
      throw new HttpException(
        {
          message: "You cannot delete another user's data",
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
    try {
      await prisma.users.delete({
        where: {
          id,
        },
      });
      throw new HttpException(
        {
          message: "user successfully deleted",
          status: HttpStatus.OK,
        },
        HttpStatus.OK
      );
    } catch (error) {
      throw new HttpException(
        {
          message: error.message,
          status: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST
      );
    }
  }
}
