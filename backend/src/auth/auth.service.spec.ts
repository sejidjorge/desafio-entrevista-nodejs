import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";

describe("AuthService", () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    jwtService = new JwtService();
    service = new AuthService(jwtService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
