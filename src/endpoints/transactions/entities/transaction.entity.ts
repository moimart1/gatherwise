import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Transaction {
  @Prop()
  _id: string;

  @Prop()
  date: string;

  @Prop()
  description: string;

  @Prop()
  amount: number;

  @Prop({ default: 'martin' })
  author: string;
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
