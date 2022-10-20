import { IsString, IsMongoId, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStoryDto {
  @ApiProperty()
  @IsMongoId()
  category: String;

  @ApiProperty()
  @IsString()
  title: String;

  @ApiProperty()
  @IsString()
  description: String;

  @ApiProperty()
  @IsUrl()
  thumbnail: String;

  @ApiProperty()
  @IsUrl()
  url: String;

  @ApiProperty()
  @IsString()
  duration: String;
}
