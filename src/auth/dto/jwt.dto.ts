import { IsString, IsEmail } from 'class-validator';

export class JWTDto {
  @IsString()
  id: string;
  @IsEmail()
  email: string;
}
