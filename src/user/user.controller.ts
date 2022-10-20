import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  HttpException,
  HttpStatus,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  ForgotPasswordDto,
  VerifyOtpDto,
  ResetPasswordDto,
} from './dto';
import { FindOneDto } from '@Dto';
import { IUserModel } from './interfaces';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from '@Guard';
import { ICurrentUser } from '@Interface';
import { ApiBody, ApiParam } from '@nestjs/swagger';

@Controller('user')
@UsePipes(new ValidationPipe())
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBody({ type: CreateUserDto })
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<IUserModel> {
    try {
      return await this.userService.create(createUserDto);
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(new JwtAuthGuard())
  @Get()
  async findAll() {
    try {
      const user = await this.userService.findAll();
      if (!user) throw new HttpException('No user exist', HttpStatus.NOT_FOUND);
      return user;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiParam(FindOneDto)
  @UseGuards(new JwtAuthGuard())
  @Get(':id')
  async findOne(@Param() findOneDto: FindOneDto): Promise<IUserModel> {
    try {
      const user = await this.userService.findOne(findOneDto);
      if (!user) throw new HttpException('No user exist', HttpStatus.NOT_FOUND);
      return user;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiBody({ type: UpdateUserDto })
  @UseGuards(new JwtAuthGuard())
  @Patch()
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @CurrentUser() currentUser: ICurrentUser,
  ): Promise<IUserModel> {
    updateUserDto._id = currentUser.id;
    return this.userService.update(updateUserDto);
  }

  @ApiBody({ type: ForgotPasswordDto })
  @Post('forgot-password')
  async forgotPassword(
    @Body() forgotPasswordDto: ForgotPasswordDto,
  ): Promise<IUserModel> {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @ApiBody({ type: VerifyOtpDto })
  @Post('verify-otp')
  @HttpCode(200)
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return this.userService.verifyOtp(verifyOtpDto);
  }

  @ApiBody({ type: ResetPasswordDto })
  @Post('reset-password')
  @HttpCode(200)
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }
}
