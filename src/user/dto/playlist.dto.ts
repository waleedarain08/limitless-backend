import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PlaylistDto {

  @ApiProperty()
  @IsString()
  videoId: string;
}
