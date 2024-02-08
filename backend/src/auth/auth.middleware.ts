import { Injectable, NestMiddleware } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}
  async use(request: Request, response: Response, next: NextFunction) {
    // biome-ignore lint/complexity/useLiteralKeys: <explanation>
    const token = request.headers["authorization"];
    if (token.length > 0) {
      try {
        const tokenSliced = token.slice(7);
        const decoded = await this.jwtService.verify(tokenSliced);
        const current = Math.floor(Date.now() / 1000);
        const expiredToken = current >= decoded.exp;
        if (expiredToken) {
          return response.status(401).json({ message: "expired token" });
        }
        next();
      } catch (error) {
        return response.status(401).json({ message: "Unauthorized" });
      }
    } else {
      return response.status(401).json({ message: "Unauthorized" });
    }
  }
}
