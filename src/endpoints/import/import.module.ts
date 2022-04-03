import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Import, ImportSchema } from './entities/import.entity';
import { ImportController } from './import.controller';
import { ImportService } from './import.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Import.name, schema: ImportSchema }])],
  controllers: [ImportController],
  providers: [ImportService],
  exports: [ImportService],
})
export class ImportModule {}
