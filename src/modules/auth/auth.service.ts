import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { GoogleAuthRequestDto, SignInRequestDto } from "./dtos/request.dto";
import { AuthResponseDto } from "./dtos/response.dto";
import { plainToInstance } from "class-transformer";
import { generateAccessToken, generateRefreshToken } from "./utils/jwt.utils";
import { use } from "passport";

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async googleAuth(req: GoogleAuthRequestDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({ where: { email: req.email } });
    if (user) {
      return await this.login(user.id);
    }

    const savedUser = await this.prisma.user.create({ data: { email: req.email, avatar: req.name } });

    const accessToken = generateAccessToken({ userId: savedUser.id, email: savedUser.email });
    const refreshToken = generateRefreshToken({ userId: savedUser.id, email: savedUser.email });
    const updateRefreshToken = await this.prisma.user.update({ where: { id: savedUser.id }, data: { refreshToken, updatedAt: new Date()
      } });
    const result = {
      ...updateRefreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }

    return plainToInstance(AuthResponseDto, result);
  }

  async signIn(data: SignInRequestDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findFirst({ where: { email: data.email } });
    if (user) {
      return await this.login(user.id);
    }

    const savedUser = await this.prisma.user.create({ data: { email: data.email , avatar: data.avatar } });

    const accessToken = generateAccessToken({ userId: savedUser.id, email: savedUser.email });
    const refreshToken = generateRefreshToken({ userId: savedUser.id, email: savedUser.email });
    const updateRefreshToken = await this.prisma.user.update({ where: { id: savedUser.id }, data: { refreshToken, updatedAt: new Date()
    } });
    const result = {
      ...updateRefreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }

    return plainToInstance(AuthResponseDto, result);
  }

  async login(id: number) {
    const user = await this.prisma.user.findFirst({ where: { id } });
    if (!user) {
      throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
    }

    const accessToken = generateAccessToken({ userId: user.id, email: user.email });
    const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });
    const updateRefreshToken = await this.prisma.user.update({ where: { id: user.id }, data: { refreshToken, updatedAt: new Date()
      } });
    const result = {
      ...updateRefreshToken,
      accessToken: accessToken,
      refreshToken: refreshToken,
    }

    return plainToInstance(AuthResponseDto, result);
  }
}
