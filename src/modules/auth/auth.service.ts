import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  GoogleAuthRequestDto,
  SignInRequestDto,
  SignUpRequestDto,
} from './dtos/request.dto';
import { AuthResponseDto, GetMeResponseDto } from './dtos/response.dto';
import { plainToInstance } from 'class-transformer';
import { generateAccessToken, generateRefreshToken } from './utils/jwt.utils';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async googleAuth(req: GoogleAuthRequestDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: req.email },
    });
    if (!user) {
      await this.prisma.user.create({
        data: { email: req.email, avatar: req.name, password: null },
      });
    }

    const savedUser = await this.prisma.user.findFirst({
      where: { email: req.email },
    });

    const accessToken = generateAccessToken({
      userId: savedUser.id,
      email: savedUser.email,
    });
    const refreshToken = generateRefreshToken({
      userId: savedUser.id,
      email: savedUser.email,
    });
    const updateRefreshToken = await this.prisma.user.update({
      where: { id: savedUser.id },
      data: { refreshToken, updatedAt: new Date() },
    });
    const result = {
      ...updateRefreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return plainToInstance(AuthResponseDto, result);
  }

  async getMe(email: string): Promise<GetMeResponseDto> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return plainToInstance(GetMeResponseDto, user);
  }

  async signUp(data: SignUpRequestDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: data.email },
    });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const savedUser = await this.prisma.user.create({
      data: {
        email: data.email,
        avatar: data.avatar,
        password: await bcrypt.hash(data.password, 10),
      },
    });

    const accessToken = generateAccessToken({
      userId: savedUser.id,
      email: savedUser.email,
    });
    const refreshToken = generateRefreshToken({
      userId: savedUser.id,
      email: savedUser.email,
    });
    const updateRefreshToken = await this.prisma.user.update({
      where: { id: savedUser.id },
      data: { refreshToken, updatedAt: new Date() },
    });
    const result = {
      ...updateRefreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return plainToInstance(AuthResponseDto, result);
  }

  async login(req: SignInRequestDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({
      where: { email: req.email },
    });
    if (!user) {
      throw new HttpException('User does not exist', HttpStatus.NOT_FOUND);
    }

    const comparePassword = await bcrypt.compare(req.password, user.password);
    if (!comparePassword) {
      throw new HttpException(
        'Access denied, incorrect password',
        HttpStatus.BAD_REQUEST,
      );
    }

    const accessToken = generateAccessToken({
      userId: user.id,
      email: user.email,
    });
    const refreshToken = generateRefreshToken({
      userId: user.id,
      email: user.email,
    });
    const updateRefreshToken = await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken, updatedAt: new Date() },
    });
    const result = {
      ...updateRefreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };

    return plainToInstance(AuthResponseDto, result);
  }
}
