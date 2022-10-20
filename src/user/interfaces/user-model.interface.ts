import { Document } from 'mongoose';
import { IUser } from './user.interface';

export interface IUserModel extends IUser, Document {}
