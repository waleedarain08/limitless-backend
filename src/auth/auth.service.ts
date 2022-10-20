import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MODEL } from '@Model';
import { UserDocument } from 'src/user/schemas';
import { JWTDto, LoginDto } from './dto';
import * as bcrypt from 'bcrypt';
import { IUserModel } from 'src/user/interfaces';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthService {
  constructor(
    @InjectModel(MODEL.USER_MODEL) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(user: LoginDto): Promise<any> {
    const isValid: IUserModel | null = await this.userModel
      .findOne({
        email: user.email,
      })
      .lean();
    if (!isValid) throw new NotFoundException('Email not found!');

    const isPassMatch = await bcrypt.compare(
      user.password,
      isValid.password as string,
    );

    if (!isPassMatch) throw new NotFoundException('Password is incorrect!');

    return isValid;
  }

  async validateFromToken(user: JWTDto): Promise<IUserModel> {
    return await this.userModel.findOne({ _id: user.id, email: user.email });
  }

  async login(user: LoginDto) {
    const validate: IUserModel = await this.validateUser(user);
    const token = await this.jwtService.signAsync(
      {
        id: validate._id,
        email: validate.email,
      },
      {
        secret: this.configService.get('JWT_SECRET_KEY'),
        expiresIn: this.configService.get('JWT_EXPIRY'),
      },
    );
    return { token, ...validate };
  }
}
