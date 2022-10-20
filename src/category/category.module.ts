import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL } from '@Model';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { CategorySchema } from './schemas';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MODEL.CATEGORY_MODEL,
        schema: CategorySchema,
      },
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
