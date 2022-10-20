import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBody, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FindOneDto } from '@Dto';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto';
import { ICategoryModel } from './interfaces';

@UseGuards(new JwtAuthGuard())
@Controller('category')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @ApiBody({ type: CreateCategoryDto })
  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ICategoryModel> {
    try {
      return await this.categoryService.create(createCategoryDto);
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @ApiParam(FindOneDto)
  @Get(':id')
  async findOne(@Param() findOneDto: FindOneDto): Promise<ICategoryModel> {
    try {
      const category = await this.categoryService.findOne(findOneDto);
      if (!category)
        throw new HttpException('No category exist', HttpStatus.NOT_FOUND);
      return category;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }

  @UseGuards(new JwtAuthGuard())
  @Get()
  async findAll(): Promise<ICategoryModel[]> {
    try {
      const category = await this.categoryService.findAll();
      if (!category)
        throw new HttpException('No category exist', HttpStatus.NOT_FOUND);
      return category;
    } catch (err) {
      throw new HttpException(
        err?.message,
        err?.status || HttpStatus.BAD_REQUEST,
      );
    }
  }
}
