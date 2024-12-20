import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategy/jwt.strategy';
import { GoogleStrategy } from './strategy/google.strategy';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [AuthService, JwtStrategy, GoogleStrategy, PrismaService],
  exports: [AuthService, JwtStrategy, GoogleStrategy, PrismaService],
})
export class AuthModule {}
