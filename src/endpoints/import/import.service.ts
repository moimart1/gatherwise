import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { createHash } from 'crypto';
import { Model } from 'mongoose';
import * as papa from 'papaparse';
import { Readable } from 'stream';
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

  findAll() {
    return `This action returns all import`;
  }

  findOne(id: number) {
    return `This action returns a #${id} import`;
  }

  update(id: number, updateImportDto: UpdateImportDto) {
    return `This action updates a #${id} import`;
  }

  remove(id: number) {
    return `This action removes a #${id} import`;
  }
}
