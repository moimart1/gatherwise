import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Synchronization {
  @Prop()
  _id: string;

  @Prop()
  transactionId: string;

  @Prop()
  outputName: string;

  @Prop()
  outputId: string;
}

export type SynchronizationDocument = Synchronization & Document;

export const SynchronizationSchema = SchemaFactory.createForClass(Synchronization);
