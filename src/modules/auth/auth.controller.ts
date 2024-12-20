import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInRequestDto, SignUpRequestDto } from './dtos/request.dto';
import { AuthResponseDto, GetMeResponseDto } from './dtos/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { CombinedAuthGuard } from './guards/auth.guard';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Google auth' })
  @ApiResponse({
    status: 200,
    description: 'Google auth',
    type: AuthResponseDto,
  })
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req): Promise<AuthResponseDto> {
    return this.authService.googleAuth(req.user);
  }

  @ApiOperation({ summary: 'Get current user' })
  @ApiResponse({
    status: 200,
    description: 'Get current user',
    type: GetMeResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Get('current-user')
  @UseGuards(CombinedAuthGuard)
  async getMe(@Req() req): Promise<GetMeResponseDto> {
    return this.authService.getMe(req.user.email);
  }

  @ApiOperation({ summary: 'Sign-up' })
  @ApiResponse({
    status: 200,
    description: 'Successfully Sign-up',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: 'User already exist' })
  @ApiBody({ type: SignUpRequestDto })
  @Post('sign-up')
  async signUp(@Body() data: SignUpRequestDto): Promise<AuthResponseDto> {
    return await this.authService.signUp(data);
  }

  @ApiOperation({ summary: 'Sign-in' })
  @ApiResponse({
    status: 200,
    description: 'Successfully Sign-in',
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({
    status: 400,
    description: 'Access denied, incorrect password',
  })
  @ApiBody({ type: SignInRequestDto })
  @Post('sign-in')
  async signIn(@Body() data: SignInRequestDto): Promise<AuthResponseDto> {
    return await this.authService.login(data);
  }
}
