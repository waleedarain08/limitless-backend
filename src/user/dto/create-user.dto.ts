import { IsString, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsString()
  name: String;

  @ApiProperty()
  @IsEmail()
  email: String;

  @ApiProperty()
  @IsString()
  password: String;
}
