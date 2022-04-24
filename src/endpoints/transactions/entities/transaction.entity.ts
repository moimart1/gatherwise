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

  @Prop({ default: 'CAD' })
  currency: string;

  @Prop({ default: 'martin' })
  author: string;

  @Prop({ default: false })
  reviewed: boolean;

  @Prop() // TODO
  source: string;
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
