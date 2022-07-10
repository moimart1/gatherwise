import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import * as papa from 'papaparse';
import { Readable } from 'stream';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { SourcesService } from '../sources/sources.service';
import { UpdateImportDto } from './dto/update-import.dto';
import { Import } from './entities/import.entity';

interface ImportOptions {
  importId: string;
}

@Injectable()
export class ImportService {
  constructor(@InjectModel(Import.name) private readonly model: Model<Import>, private sourceService: SourcesService) {}

  private importCsv(file: Express.Multer.File, { importId }: ImportOptions): Promise<Import> {
    return new Promise((resolve, reject) => {
      papa.parse(Readable.from(file.buffer), {
        header: true,
        complete: async (results) => {
          if (results?.errors.length > 0) {
            return reject(new BadRequestException(`When parse CSV: ${JSON.stringify(results.errors)}`));
          }

          const { _id: sourceId } = await this.sourceService.findOrCreateFromFields(results.meta.fields, file.mimetype);
          // Map data for database
          const db = new this.model({
            _id: importId,
            sourceId,
            name: file.originalname,
            mimetype: file.mimetype,
            data: results.data,
          });

          resolve(db.save());
        },
        error: reject,
      });
    });
  }

  async createFromFile(file: Express.Multer.File) {
    // Create hash from file buffer to avoid to import multiple times the same content
    const importId = createHash('sha1').update(file.buffer).digest('hex');
    let result: Import;

    switch (file.mimetype) {
      case 'text/csv':
        result = await this.importCsv(file, { importId });
        break;
      default:
        throw new BadRequestException(`Format ${file.mimetype} not supported`);
    }

    delete result.data; // Don't need to resend all data
    return result;
  }

  createFromSplitwise() {
    //TODO
  }

  findAll(pagination: PaginationQueryDto): Promise<Import[]> {
    return this.model.find().skip(pagination.offset).limit(pagination.limit).exec();
  }

  async findById(id: string): Promise<Import> {
    const result = await this.model.findById(id).exec();

    if (!result) {
      throw new NotFoundException(`When findById() ${this.model.modelName} ${id} not found.`);
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

  async convertToTransactions(id: string) {
    const importation = await this.findById(id);
    await this.sourceService.fromImportationToTransactions(importation);
    return await this.update(id, { convertedAt: new Date().toISOString() });
  }
}
