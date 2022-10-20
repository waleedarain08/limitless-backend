import { IsMongoId, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ResetPasswordDto {
  @ApiProperty()
  @IsMongoId()
  _id: String;

  @ApiProperty()
  @IsString()
  resetToken: String;

  @ApiProperty()
  @IsString()
  password: String;
}
