import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SignUpRequestDto {
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class SignInRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}

export class GoogleAuthRequestDto {
  name: string;
  email: string;
}
