export interface IUserOTP {
  code: Number;
  createdAt: Date;
}

export interface IUser {
  name: String;
  email: String;
  password: String;
  resetToken?: String;
  age?: number;
  avatar?: String;
  dob?: Date;
  otp?: IUserOTP[];
}
