import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
  Res,
  UsePipes,
  ValidationPipe,
  Query,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { FileService } from './file.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { DeleteFileDto } from './dto/delete-file.dto';
import LocalFilesInterceptor from 'src/config/localFiles.interceptor';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/images',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          //mimetype will be extensions/mimetype of file which you wants to upload
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  addImage(@UploadedFile() file: CreateFileDto, @Res() _res: any) {
    return this.fileService
      .create(file)
      .then((res) => {
        if (res) {
          return _res.status(200).json({
            data: res,
            error: false,
            message: ' Image uploaded',
          });
        } else {
          return _res.status(200).json({
            data: res,
            error: true,
            message: 'Error in uploading Image',
          });
        }
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  // @Post('/uploadMultipleFiles')
  // @UseInterceptors(FilesInterceptor('files'))
  // createMany(@UploadedFile() files: CreateFileDto[], @Res() _res: any) {
  //   return this.fileService
  //     .createMany(files)
  //     .then((res) => {
  //        console.log(res);
  //       if (res) {
  //         return _res.status(200).json({
  //           data: res,
  //           error: false,
  //           message: ' Files uploaded',
  //         });
  //       } else {
  //         return _res.status(400).json({
  //           data: res,
  //           error: true,
  //           message: 'Error in uploading File',
  //         });
  //       }
  //     })
  //     .catch((e) => {
  //       console.log('e', e);
  //        throw new HttpException(e.message, 500);
  //     });
  // }

  @Get()
  findAll(
    @Query(
      new ValidationPipe({
        transform: true,
      }),
    )
    query: any,
  ) {
    return this.fileService.findAll(query).catch((e) => {
      throw new HttpException(e.message, 500);
    });
  }

  @Get(':id')
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @Res({ passthrough: true })
    _res: any,
  ) {
    return this.fileService.findOne(id).catch((e) => {
      throw new HttpException(e.message, 500);
    });
  }

  @Patch(':id')
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'file',
      path: '/images',
      fileFilter: (request, file, callback) => {
        if (!file.mimetype.includes('image')) {
          return callback(
            new BadRequestException('Provide a valid image'),
            false,
          );
        }
        callback(null, true);
      },
    }),
  )
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() updateFileDto: UpdateFileDto,
    @Res() _res: any,
  ) {
    return this.fileService
      .update(id, updateFileDto)
      .then((res) => {
        if (res) {
          return _res.status(200).json({
            data: res,
            error: true,
            message: 'Image updated',
          });
        } else {
          return _res.status(500).json({
            data: res,
            error: true,
            message: 'error in updating Image',
          });
        }
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string, @Res() _res: any) {
    return this.fileService
      .remove(id)
      .then((res) => {
        if (res) {
          return _res.status(200).json({
            data: res,
            error: false,
            message: 'Image deleted',
          });
        } else {
          return _res.status(500).json({
            data: res,
            error: true,
            messgae: 'error in Image',
          });
        }
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  @Delete()
  @UsePipes(new ValidationPipe({ transform: true }))
  removeMany(@Body() deleteFileDto: DeleteFileDto, @Res() _res: any) {
    return this.fileService
      .removemany(deleteFileDto)
      .then((res) => {
        if (res) {
          return _res.status(200).json({
            data: res,
            error: false,
            message: 'Images deleted',
          });
        } else {
          return _res.status(500).json({
            data: res,
            error: true,
            messgae: 'error in deleting Images',
          });
        }
      })
      .catch((e) => {
        console.log(e);
        throw new HttpException(e.message, 500);
      });
  }
}
