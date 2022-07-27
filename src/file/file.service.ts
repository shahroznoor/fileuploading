import { Injectable, HttpException, Res } from '@nestjs/common';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { DeleteFileDto } from './dto/delete-file.dto';

@Injectable()
export class FileService {
  constructor(private readonly prismaService: PrismaService) {}
  create(createFileDto: CreateFileDto) {
    return this.prismaService.file
      .create({
        data: createFileDto,
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  // createMany(createmulFileDto: CreateFileDto[]) {
  //   {
  //     createmulFileDto.map((data) => {
  //       data.destination,
  //         data.encoding,
  //         data.fieldname,
  //         data.filename,
  //         data.mimetype,
  //         data.originalname,
  //         data.path,
  //         data.size;
  //     });
  //   }

  //   return this.prismaService.file
  //     .createMany({
  //       data: createmulFileDto,
  //     })
  //     .catch((e) => {
  //       console.log('e', e);
  //     });
  // }

  findAll(query: any = {}) {
    const take: any = query?.take ? parseInt(query?.take) : 10;
    const skip = query?.skip ? (parseInt(query?.skip) - 1) * parseInt(take) : 0;
    const sort = query?.sort ? query?.sort : 'asc';
    return this.prismaService.file
      .findMany({
        skip,
        take,
        orderBy: {
          createdAt: sort,
        },
      })
      .then((data) => {
        return this.prismaService.file.count().then((res) => {
          if (res) {
            return {
              data,
              message: 'All Files are fetched',
              count: res,
              error: false,
            };
          } else {
            return {
              error: false,
              message: 'error in fetching Files',
            };
          }
        });
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  findOne(id: string) {
    return this.prismaService.file
      .findUnique({
        where: {
          id,
        },
      })
      .then((data) => {
        if (data) {
          return {
            data,
            message: 'Files FETCHED',
            error: false,
          };
        } else {
          return {
            error: true,
            messgae: 'ERRORS IN FETCHING Files',
          };
        }
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  update(id: string, updateFileDto: UpdateFileDto) {
    return this.prismaService.file
      .update({
        where: {
          id,
        },
        data: updateFileDto,
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  remove(id: string) {
    return this.prismaService.file
      .delete({
        where: {
          id,
        },
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }

  removemany(deleteFileDto: DeleteFileDto) {
    return this.prismaService.file
      .deleteMany({
        where: {
          id: { in: deleteFileDto.id },
        },
      })
      .catch((e) => {
        throw new HttpException(e.message, 500);
      });
  }
}
