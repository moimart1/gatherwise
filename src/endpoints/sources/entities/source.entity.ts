import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

export enum MappingType {
  datetime = 'date',
  description = 'description',
  category = 'category',
  amount = 'amount',
  author = 'author',
}

// Nested Schema
@Schema({ _id: false })
export class Mapping {
  @Prop()
  type: string;

  @Prop()
  isNegative: boolean;
}

export const MappingSchema = SchemaFactory.createForClass(Mapping);

@Schema({ timestamps: true })
export class Source {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  /**
   * List of values to ignore in very values of very fields
   */
  @Prop()
  excludedValues: string[];

  /**
   * List of values to ignore in very values of very fields
   */
  @Prop({ type: mongoose.Schema.Types.Map, of: MappingSchema })
  mapping: Map<string, Mapping>;
}

export type SourceDocument = Source & Document;

export const SourceSchema = SchemaFactory.createForClass(Source);
