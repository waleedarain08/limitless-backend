import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model,Types } from 'mongoose';
import { MODEL } from '@Model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDocument } from './schemas';
import * as bcrypt from 'bcrypt';
import { IUserModel } from './interfaces';
import { ForgotPasswordDto, ResetPasswordDto, VerifyOtpDto } from './dto';
import { MailService } from 'src/mail/mail.service';
import { FindOneDto } from '@Dto';
import { contains } from 'class-validator';
import { StoryDocument } from '@/story/schema';
@Injectable()
export class UserService {
  constructor(
    @InjectModel(MODEL.USER_MODEL) private userModel: Model<UserDocument>,
    @InjectModel(MODEL.STORY_MODEL) private storyModel: Model<StoryDocument>,
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

  async findAllPlaylist(userId:string): Promise<IUserModel[]> {
    let users =  await this.userModel.find({_id:userId});
    if(users.length>0){
      let playlistArr = [...users[0].playlist]
        //@ts-ignore
        const stories = await this.storyModel
        //@ts-ignore
      .aggregate([
        //@ts-ignore
         {$match : {$expr:{$in : ["$_id",playlistArr] }}},

        // {$match:{playlist:{$in:users[0].playlist}}},
        {
          $lookup: {
            from: MODEL.CATEGORY_MODEL,
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {$lookup:{
          from:MODEL.USER_MODEL,
          let:{userId:userId},
          as:"user",
          pipeline:[
            //@ts-ignore
            {$match:{$expr:{$eq:["$_id","$$userId"]}}}
          ]
        }},
        //@ts-ignore
        { $unwind: '$category' },
        
         //@ts-ignore
        {$addFields:{user:{$arrayElemAt:["$user",0]}}},
        //@ts-ignore
        {$addFields:{isPlaylist:{$in:["$_id","$user.playlist"]}}},
        //@ts-ignore
        {$addFields:{isFavourite:{$in:["$_id","$user.favourite"]}}},
      ])
      .allowDiskUse(true);

    if (!stories || !stories.length)
      throw new NotFoundException('No stories found!');

    return await stories
    }
    return []
  }

    async findAllFavourite(userId:string): Promise<IUserModel[]> {
    let users =  await this.userModel.find({_id:userId});
    if(users.length>0){
      let favouriteArr = [...users[0].favourite]
        //@ts-ignore
        const stories = await this.storyModel
        //@ts-ignore
      .aggregate([
        //@ts-ignore
         {$match : {$expr:{$in : ["$_id",favouriteArr] }}},

        // {$match:{playlist:{$in:users[0].playlist}}},
        {
          $lookup: {
            from: MODEL.CATEGORY_MODEL,
            localField: 'category',
            foreignField: '_id',
            as: 'category',
          },
        },
        {$lookup:{
          from:MODEL.USER_MODEL,
          let:{userId:userId},
          as:"user",
          pipeline:[
            //@ts-ignore
            {$match:{$expr:{$eq:["$_id","$$userId"]}}}
          ]
        }},
        { $unwind: '$category' },
        //@ts-ignore
        {$addFields:{user:{$arrayElemAt:["$user",0]}}},
        //@ts-ignore
        {$addFields:{isPlaylist:{$in:["$_id","$user.playlist"]}}},
        //@ts-ignore
        {$addFields:{isFavourite:{$in:["$_id","$user.favourite"]}}},

       
      ])
      .allowDiskUse(true);

    if (!stories || !stories.length)
      throw new NotFoundException('No stories found!');

    return await stories
    }
    return []
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

  async addPlaylist(userId:string, videoId:string):Promise<any>{
      let result = await this.userModel.updateOne({_id:userId },{$addToSet:{playlist:new Types.ObjectId(videoId)}});
      return result
  }

  async removePlaylist(userId:string, videoId:string):Promise<any>{
    let result = await this.userModel.updateOne({_id:userId },{$pull:{playlist:new Types.ObjectId(videoId)} });
    return result
  }


  async addFavourite(userId:string, videoId:string):Promise<any>{
      let result = await this.userModel.updateOne({_id:userId },{$addToSet:{favourite:new Types.ObjectId(videoId)}});
      return result
  }

  async removeFavourite(userId:string, videoId:string):Promise<any>{
    let result = await this.userModel.updateOne({_id:userId },{$pull:{favourite:new Types.ObjectId(videoId)} });
    return result
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
