import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SourcesModule } from '../sources/sources.module';
import { Import, ImportSchema } from './entities/import.entity';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Import.name, schema: ImportSchema }]), SourcesModule],
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
