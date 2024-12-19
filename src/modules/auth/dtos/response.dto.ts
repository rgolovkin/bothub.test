import { Exclude, Expose } from "class-transformer";

@Exclude()
export class AuthResponseDto {
  @Expose()
  avatar: string;

  @Expose()
  email: string;

  @Expose()
  accessToken: string;

  @Expose()
  refreshToken: string;
}