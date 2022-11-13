import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Contact, ContactSchema } from '../../contacts/entities/contact.entity';

@Schema({ _id: false })
export class TransactionShare {
  @Prop({ type: ContactSchema })
  contact: string | Contact;

  /**
   * Amount paid by the contact
   */
  @Prop({ type: Number })
  paid: number;

  /**
   * Amount that the contact need to pay of the transaction
   */
  @Prop({ type: Number })
  owed: number;
}

const TransactionShareSchema = SchemaFactory.createForClass(TransactionShare);

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

  @Prop({ default: false })
  reviewed: boolean;

  @Prop()
  note: string;

  @Prop() // TODO
  source: string;

  @Prop({ type: [TransactionShareSchema] })
  shares: TransactionShare[];
}

export type TransactionDocument = Transaction & Document;

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
