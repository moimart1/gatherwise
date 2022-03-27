import { Injectable } from '@nestjs/common';
import * as papa from 'papaparse';
import { Readable } from 'stream';
import { CreateSourceDto } from './dto/create-source.dto';
import { UpdateSourceDto } from './dto/update-source.dto';

@Injectable()
export class SourcesService {
  private parseStream: NodeJS.ReadWriteStream;

  constructor() {
    this.parseStream = papa.parse(papa.NODE_STREAM_INPUT, { header: true });
  }

  importFile(file: Express.Multer.File) {
    let count = 0;
    const parseStream = papa.parse(papa.NODE_STREAM_INPUT, { header: true });
    return new Promise((resolve, rejects) => {
      // TODO on error
      Readable.from(file.buffer)
        .pipe(parseStream)
        .on('error', console.error)
        .on('data', (row) => {
          count++;
          console.log(row); // TODO
        })
        .on('end', () => resolve({ count }));
    });
  }

  create(createSourceDto: CreateSourceDto) {
    return 'This action adds a new source';
  }

  findAll() {
    return `This action returns all sources`;
  }

  findOne(id: number) {
    return `This action returns a #${id} source`;
  }

  update(id: number, updateSourceDto: UpdateSourceDto) {
    return `This action updates a #${id} source`;
  }

  remove(id: number) {
    return `This action removes a #${id} source`;
  }
}
