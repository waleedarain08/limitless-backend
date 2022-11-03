import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindOneDto, PaginationDto } from '@Dto';
import { IPaginatedResult } from '@Interface';
import { CreateStoryDto } from './dto';
import { IStoryCategories, IStoryModel } from './interfaces';
import { StoryService } from './story.service';

@UseGuards(new JwtAuthGuard())
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('story')
export class StoryController {
  constructor(private storyService: StoryService) {}

  @ApiBody({ type: CreateStoryDto })
  @Post()
  async create(@Body() createStoryDto: CreateStoryDto): Promise<IStoryModel> {
    try {
      return await this.storyService.create(createStoryDto);
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(
    @Query() paginationDto: PaginationDto,
  ): Promise<IPaginatedResult> {
    try {
      const story = await this.storyService.findAll(paginationDto);
      if (!story)
        throw new HttpException('No stories exist', HttpStatus.NOT_FOUND);
      return story;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

   @Get('categories')
  async findAllByCategories(): Promise<IStoryCategories[]> {
    try {
      const story = await this.storyService.findAllByCategories();
      if (!story)
        throw new HttpException('No stories exist', HttpStatus.NOT_FOUND);
      return story;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('categories/:id')
  async findAllByCategoriesId(@Param('id') id:string): Promise<IStoryCategories[]> {
    try {
      const story = await this.storyService.findAllByCategoriesId(id);
      if (!story)
        throw new HttpException('No stories exist', HttpStatus.NOT_FOUND);
      return story;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiParam(FindOneDto)
  @Get(':id')
  async findOne(@Param() findOneDto: FindOneDto): Promise<IStoryModel> {
    try {
      const story = await this.storyService.findOne(findOneDto);
      if (!story)
        throw new HttpException('No story exist', HttpStatus.NOT_FOUND);
      return story;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
 
}
