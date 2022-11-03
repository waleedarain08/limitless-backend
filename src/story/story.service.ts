import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Mongoose, Types } from 'mongoose';
import { FindOneDto, PaginationDto } from '@Dto';
import { paginationHelper, paginationResponse } from '@Helper';
import { IPaginatedResult } from '@Interface';
import { MODEL } from '@Model';
import { CreateStoryDto } from './dto';
import { IStoryCategories, IStoryModel } from './interfaces';
import { StoryDocument } from './schema';

@Injectable()
export class StoryService {
  constructor(
    @InjectModel(MODEL.STORY_MODEL) private storyModel: Model<StoryDocument>,
  ) {}

  async create(createStoryDto: CreateStoryDto): Promise<IStoryModel> {
    const category = new Types.ObjectId(createStoryDto.category as string);
    const story = new this.storyModel({ category, ...createStoryDto });
    return await story.save();
  }

  async findAll(userId:string,paginationDto: PaginationDto): Promise<IPaginatedResult> {
    const { search, perPage, page } = paginationDto;

    const project = {
      title: 1,
      description: 1,
      thumbnail: 1,
      url: 1,
      user:1,
      views: 1,
      createdAt: 1,
      category: 1,
    };

    const stories = await this.storyModel
      .aggregate([
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
        // {$unwind:"$user.playlist"},
        // {
        //   $facet: {
        //     count: [{ $count: 'total' }],
        //     data: paginationHelper(search, page - 1, perPage, project, [
        //       'title',
        //     ]),
        //   },
        // },
      ])
      .allowDiskUse(true);

    if (!stories || !stories.length)
      throw new NotFoundException('No stories found!');

    return await paginationResponse(stories[0], paginationDto);
  }

  async findOne(findOneDto: FindOneDto): Promise<IStoryModel> {
    return await this.storyModel
      .findOne({ _id: findOneDto.id })
      .populate('category');
  }

  async findAllByCategories(): Promise<IStoryCategories[]> {
    return await this.storyModel.aggregate([
      {
        $lookup: {
          from: MODEL.CATEGORY_MODEL,
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: '$categoryData' },
      {
        $group: {
          _id: '$category',
          categoryData: { $first: '$categoryData' },
          stories: {
            $push: {
              _id: '$_id',
              title: '$title',
              description: '$description',
              thumbnail: '$thumbnail',
              url: '$url',
              duration: '$duration',
              views: '$views',
              createdAt: '$createdAt',
            },
          },
        },
      },
      {
        $project: {
          categoryData: {
            name: '$categoryData.name',
            image: '$categoryData.image',
          },
          stories: 1,
        },
      },
    ]);
  }

  async findAllByCategoriesId(id:string): Promise<IStoryCategories[]> {
    return await this.storyModel.aggregate([
      //@ts-ignore
      {$match:{category:new Types.ObjectId(id)}},

      {
        $lookup: {
          from: MODEL.CATEGORY_MODEL,
          localField: 'category',
          foreignField: '_id',
          as: 'categoryData',
        },
      },
      { $unwind: '$categoryData' },
      {
        $group: {
          _id: '$category',
          categoryData: { $first: '$categoryData' },
          stories: {
            $push: {
              _id: '$_id',
              title: '$title',
              description: '$description',
              thumbnail: '$thumbnail',
              url: '$url',
              duration: '$duration',
              views: '$views',
              createdAt: '$createdAt',
            },
          },
        },
      },
      {
        $project: {
          categoryData: {
            name: '$categoryData.name',
            image: '$categoryData.image',
          },
          stories: 1,
        },
      },
    ]);
  }
}
