import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignInRequestDto {
  @IsNotEmpty()
  @IsString()
  avatar: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}

export class GoogleAuthRequestDto {
  name: string;
  email: string;
}