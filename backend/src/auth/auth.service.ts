import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { $Enums } from "@prisma/client";

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
  constructor(private jwtService: JwtService) {}

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
}
