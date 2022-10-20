import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FindOneDto } from '@Dto';
import { MODEL } from '@Model';
import { CreateCategoryDto } from './dto';
import { ICategoryModel } from './interfaces';
import { CategoryDocument } from './schemas';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(MODEL.CATEGORY_MODEL)
    private categoryModel: Model<CategoryDocument>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<ICategoryModel> {
    return await this.categoryModel.create({ ...createCategoryDto });
  }

  async findOne(findOneDto: FindOneDto): Promise<ICategoryModel> {
    return await this.categoryModel.findOne({ _id: findOneDto.id });
  }

  async findAll(): Promise<ICategoryModel[]> {
    return await this.categoryModel.find();
  }
}
