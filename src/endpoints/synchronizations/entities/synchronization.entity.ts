import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Synchronization {
  @Prop({ auto: true, type: MongooseSchema.Types.ObjectId })
  _id: mongoose.ObjectId;

  @Prop()
  transactionId: string;

  @Prop()
  outputName: string;

  @Prop()
  outputId: string;
}

export type SynchronizationDocument = Synchronization & Document;

export const SynchronizationSchema = SchemaFactory.createForClass(Synchronization);
