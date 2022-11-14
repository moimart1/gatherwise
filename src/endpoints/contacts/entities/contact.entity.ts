import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ObjectId, Schema as MongooseSchema } from 'mongoose';

@Schema()
class ContactLinks {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id?: ObjectId;

  @Prop()
  service: 'splitwise' | string;

  @Prop()
  id: string;
}

const ContactLinksSchema = SchemaFactory.createForClass(ContactLinks);

@Schema({ timestamps: true })
export class Contact {
  @Prop({ type: MongooseSchema.Types.ObjectId, auto: true })
  _id: ObjectId;

  @Prop()
  name: string;

  @Prop({ required: false })
  email?: string;

  @Prop({ required: false })
  phone?: string;

  @Prop({ type: [ContactLinksSchema], required: false })
  links?: ContactLinks[];
}

export type ContactDocument = Contact & Document;

export const ContactSchema = SchemaFactory.createForClass(Contact);
