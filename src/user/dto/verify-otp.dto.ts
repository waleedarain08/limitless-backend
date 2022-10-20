import { IsEmail, IsNumber, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyOtpDto {
  @ApiProperty()
  @IsEmail()
  email: String;

  @ApiProperty()
  @IsNumber()
  @Min(1000)
  @Max(9999)
  otp: Number;
}
