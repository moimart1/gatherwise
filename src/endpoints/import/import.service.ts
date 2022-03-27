import { BadRequestException, Injectable } from '@nestjs/common';
import * as papa from 'papaparse';
import { Readable } from 'stream';
import { UpdateImportDto } from './dto/update-import.dto';

@Injectable()
export class ImportService {
  importCsv(file: Express.Multer.File) {
    return new Promise((resolve, reject) => {
      papa.parse(Readable.from(file.buffer), {
        header: true,
        complete: (results) => {
          if (results?.errors.length > 0) {
            return reject(new BadRequestException(`When parse CSV: ${JSON.stringify(results.errors)}`));
          }

          resolve(results.data);
        },
        error: reject,
      });
    });
  }

  create(file: Express.Multer.File) {
    switch (file.mimetype) {
      case 'text/csv':
        return this.importCsv(file);
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
