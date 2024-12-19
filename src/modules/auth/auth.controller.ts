import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInRequestDto } from "./dtos/request.dto";
import { AuthResponseDto } from "./dtos/response.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req) {
    return this.authService.googleAuth(req.user);
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInRequestDto): Promise<AuthResponseDto> {
    return await this.authService.signIn(data);
  }
}
