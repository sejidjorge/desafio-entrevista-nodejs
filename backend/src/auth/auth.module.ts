import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './auth.middleware';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [JwtModule.register({ secret: process.env.PRIVATE_KEY })],
  providers: [AuthService, AuthMiddleware],
  exports: [AuthService, AuthMiddleware],
})
export class AuthModule {}

