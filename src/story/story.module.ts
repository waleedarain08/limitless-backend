import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MODEL } from '@Model';
import { StorySchema } from './schema';
import { StoryController } from './story.controller';
import { StoryService } from './story.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: MODEL.STORY_MODEL,
        schema: StorySchema,
      },
    ]),
  ],
  controllers: [StoryController],
  providers: [StoryService],
})
export class StoryModule {}
