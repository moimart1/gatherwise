import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Import {
  @Prop()
  _id: string;

  @Prop()
  name: string;

  @Prop()
  mimetype: string;

  @Prop()
  fields: string[];

  @Prop()
  data: [{ [key: string]: string }];
}

export type ImportDocument = Import & Document;

export const ImportSchema = SchemaFactory.createForClass(Import);
