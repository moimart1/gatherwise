import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { UpdateImportDto } from './dto/update-import.dto';
import { ImportService } from './import.service';

@Controller('import')
export class ImportController {
  constructor(private readonly importService: ImportService) {}

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.importService.createFromFile(file);
  }

  @Get()
  findAll(@Query() paginationQuery: PaginationQueryDto) {
    return this.importService.findAll(paginationQuery);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.importService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateImportDto) {
    return this.importService.update(id, data);
  }

  @Put(':id/convert')
  convert(@Param('id') id: string) {
    return this.importService.convertToTransactions(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.importService.remove(id);
  }
}
