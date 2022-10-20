import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  name: String;

  @ApiProperty()
  @IsString()
  @IsOptional()
  image?: String;
}
