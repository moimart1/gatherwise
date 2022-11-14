import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SplitwiseService } from '../../splitwise/splitwise.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Contact } from './entities/contact.entity';

@Injectable()
export class ContactsService {
  constructor(@InjectModel(Contact.name) private readonly model: Model<Contact>, private splitwise: SplitwiseService) {}

  async create(data: CreateContactDto) {
    return await new this.model(data).save();
  }

  async findAll(query: QueryContactDto) {
    const searchRegex = new RegExp(query?.search);
    const filter = query?.search ? { $or: [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }] } : {};
    return await this.model.find(filter);
  }

  async findById(id: string) {
    const result = await this.model.findById(id);

    if (!result) {
      throw new NotFoundException(`When findById() ${this.model.modelName} ${id} not found.`);
    }

    return result;
  }

  async updateById(id: string, data: UpdateContactDto) {
    const existing = await this.model.findByIdAndUpdate(id, data, { new: true });

    if (!existing) {
      throw new NotFoundException(`When updateById() ${this.model.modelName} ${id} not found`);
    }

    return existing;
  }

  async removeById(id: string) {
    const deleted = await this.model.findByIdAndRemove(id);

    if (!deleted) {
      throw new NotFoundException(`When removeById() ${this.model.modelName} ${id} not found`);
    }

    return deleted;
  }

  async syncWithSplitwise(): Promise<Contact[]> {
    const friends = await this.splitwise.getFriends();
    const friendsAlreadySync = (
      await this.model.find({ 'links.service': 'splitwise', 'links.id': { $in: friends.map((el) => String(el.id)) } })
    ).map((el) => el.links.find((link) => link.service === 'splitwise').id);

    const result: Contact[] = [];
    for (const friend of friends) {
      const friendId = String(friend.id);
      if (friendsAlreadySync.includes(friendId)) continue;
      result.push(
        await this.create({
          name: `${friend.first_name} ${friend.last_name}`,
          email: friend?.email,
          links: [{ id: friendId, service: 'splitwise' }],
        }),
      );
    }

    return result;
  }
}
