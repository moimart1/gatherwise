import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import * as papa from 'papaparse';
import { Readable } from 'stream';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { UpdateImportDto } from './dto/update-import.dto';
import { Import } from './entities/import.entity';

interface ImportOptions {
  importId: string;
}

@Injectable()
export class ImportService {
  constructor(@InjectModel(Import.name) private readonly model: Model<Import>) {}

  importCsv(file: Express.Multer.File, { importId }: ImportOptions) {
    return new Promise((resolve, reject) => {
      papa.parse(Readable.from(file.buffer), {
        header: true,
        complete: (results) => {
          if (results?.errors.length > 0) {
            return reject(new BadRequestException(`When parse CSV: ${JSON.stringify(results.errors)}`));
          }

          // Map data for database
          const db = new this.model({
            _id: importId,
            name: file.originalname,
            fields: results.meta.fields,
            mimetype: file.mimetype,
            data: results.data,
          });

          resolve(db.save());
        },
        error: reject,
      });
    });
  }

  create(file: Express.Multer.File) {
    // Create hash from file buffer to avoid to import multiple times the same content
    const importId = createHash('sha1').update(file.buffer).digest('hex');

    switch (file.mimetype) {
      case 'text/csv':
        return this.importCsv(file, { importId });
      default:
        throw new BadRequestException(`Format ${file.mimetype} not supported`);
    }
  }

  findAll(pagination: PaginationQueryDto): Promise<Import[]> {
    return this.model.find().skip(pagination.offset).limit(pagination.limit).exec();
  }

  async findOne(id: string): Promise<Import> {
    const result = await this.model.findById(id).exec();

    if (!result) {
      throw new NotFoundException(`When findOne() ${this.model.modelName} ${id} not found.`);
    }

    return result;
  }

  async update(id: string, data: UpdateImportDto): Promise<Import> {
    const existing = await this.model.findByIdAndUpdate(id, data, { new: true });

    if (!existing) {
      throw new NotFoundException(`When update() ${this.model.modelName} ${id} not found`);
    }

    return existing;
  }

  async remove(id: string): Promise<Import> {
    const deleted = await this.model.findByIdAndRemove(id);

    if (!deleted) {
      throw new NotFoundException(`When remove() ${this.model.modelName} ${id} not found`);
    }

    return deleted;
  }
}
