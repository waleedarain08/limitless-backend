import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import { Document, Schema as mongooseSchema } from 'mongoose';
import { Category } from 'src/category/schemas';
import { MODEL } from '@Model';

export type StoryDocument = Story & Document;

@Schema({ timestamps: true })
export class Story {
  @Prop({
    type: mongooseSchema.Types.ObjectId,
    ref: MODEL.CATEGORY_MODEL,
    required: true,
  })
  @Type(() => Category)
  category: Category;

  @Prop({ type: mongooseSchema.Types.String, required: true })
  title: String;

  @Prop({ type: mongooseSchema.Types.String, required: true })
  description: String;

  @Prop({ type: mongooseSchema.Types.String, required: true })
  thumbnail: String;

  @Prop({ type: mongooseSchema.Types.String, required: true })
  url: String;

  @Prop({ type: mongooseSchema.Types.String, required: true })
  duration: String;

  @Prop({ type: mongooseSchema.Types.Number, default: 0 })
  views?: Number;
}

export const StorySchema = SchemaFactory.createForClass(Story);
