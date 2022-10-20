import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as mongooseSchema } from 'mongoose';

export type CategoryDocument = Category & Document;

@Schema({ timestamps: true })
export class Category {
  @Prop({ type: mongooseSchema.Types.String, required: true })
  name: String;

  @Prop({ type: mongooseSchema.Types.String })
  image?: String;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
