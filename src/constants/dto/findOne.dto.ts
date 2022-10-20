import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class FindOneDto {
  @ApiProperty()
  @IsMongoId()
  id: String;
}
