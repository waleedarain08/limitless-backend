import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ type: mongooseSchema.Types.String, required: true })
  name: String;

  @Prop({
    type: mongooseSchema.Types.String,
    required: true,
    unique: true,
    index: true,
  })
  email: String;

  @Prop({ type: mongooseSchema.Types.String, required: true })
  password: String;

  @Prop({ type: mongooseSchema.Types.String })
  resetToken: String;

  @Prop({ type: mongooseSchema.Types.Date })
  dob?: Date;

  @Prop({ type: mongooseSchema.Types.Number })
  age?: number;

  @Prop({ type: mongooseSchema.Types.String })
  avatar?: String;

  @Prop({ type: mongooseSchema.Types.Array, required: false })
  otp?: UserOTP[];
}

class UserOTP {
  @Prop({
    type: mongooseSchema.Types.Number,
    required: true,
    min: 1000,
    max: 9999,
  })
  code: Number;

  @Prop({ type: mongooseSchema.Types.Date, required: true })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
