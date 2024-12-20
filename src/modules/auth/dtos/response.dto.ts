import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class AuthResponseDto {
  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  accessToken: string;

  @ApiProperty()
  @Expose()
  refreshToken: string;
}

@Exclude()
export class GetMeResponseDto {
  @ApiProperty()
  @Expose()
  avatar: string;

  @ApiProperty()
  @Expose()
  email: string;
}
