import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MODEL } from '@Model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas';
import * as bcrypt from 'bcrypt';
import { IUserModel } from './interfaces';
import { ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto';
import { MailService } from 'src/mail/mail.service';
import { FindOneDto } from '@Dto';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(MODEL.USER_MODEL) private userModel: Model<UserDocument>,
    private mailService: MailService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<IUserModel> {
    const salt = await bcrypt.genSalt();
    createUserDto.password = await bcrypt.hash(
      createUserDto.password as string,
      salt,
    );
    const user = new this.userModel(createUserDto);
    return await user.save();
  }

  async findAll(): Promise<IUserModel[]> {
    return await this.userModel.find({});
  }

  async findOne(findOneDto: FindOneDto): Promise<IUserModel> {
    return await this.userModel.findOne({ _id: findOneDto.id });
  }

  async update(updateUserDto: UpdateUserDto): Promise<IUserModel> {
    const { _id, ...payload } = updateUserDto;
    return await this.userModel.findByIdAndUpdate(
      { _id },
      { $set: { ...payload } },
      { new: true },
    );
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
  ): Promise<IUserModel> {
    const user: IUserModel = await this.userModel.findOne({
      email: forgotPasswordDto.email,
    });
    if (!user)
      throw new HttpException('Email not found!', HttpStatus.NOT_FOUND);

    const otp = {
      code: Math.floor(1000 + Math.random() * 9000),
      createdAt: new Date(),
    };

    await this.mailService.sendMail(
      user.email as string,
      'Reset Password OTP',
      { name: user.name, code: otp.code },
      'forgot-password',
    );

    return await this.userModel.findOneAndUpdate(
      { _id: user.id },
      {
        $push: {
          otp,
        },
      },
      { new: true },
    );
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto): Promise<IUserModel> {
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() - 2);
    const user: IUserModel = await this.userModel.findOne({
      email: verifyOtpDto.email,
      otp: {
        $elemMatch: {
          code: verifyOtpDto.otp,
          createdAt: {
            $gte: currentDate,
          },
        },
      },
    });

    if (!user) throw new HttpException('OTP not found!', HttpStatus.NOT_FOUND);

    const salt = await bcrypt.genSalt();
    user.resetToken = await bcrypt.hash(user.email as string, salt);
    await user.save();

    return user;
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<IUserModel> {
    const salt = await bcrypt.genSalt();
    resetPasswordDto.password = await bcrypt.hash(
      resetPasswordDto.password as string,
      salt,
    );
    return await this.userModel.findOneAndUpdate(
      { _id: resetPasswordDto._id, resetToken: resetPasswordDto.resetToken },
      {
        $set: {
          password: resetPasswordDto.password,
        },
      },
      { new: true },
    );
  }
}