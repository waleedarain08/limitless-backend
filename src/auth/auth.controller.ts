import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  HttpCode,
} from '@nestjs/common';
import { ApiBody } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto';

@Controller('auth')
@UsePipes(new ValidationPipe())
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<any> {
    try {
      return await this.authService.login(loginDto);
    } catch (err) {
      throw new HttpException(err?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
