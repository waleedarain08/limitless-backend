import { Document } from 'mongoose';
import { ICategory } from './category.interface';

export interface ICategoryModel extends ICategory, Document {}
