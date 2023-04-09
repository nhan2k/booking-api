import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs';

@Module({
  imports: [
    TypeOrmModule.forFeature([Room, Hotel, RoomType]),
    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = extname(file.originalname);
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          if (req.url.includes('room')) {
            const folderName = './uploads/room';

            if (!fs.existsSync(folderName)) {
              fs.mkdirSync(folderName);
            }
            return callback(null, `room/${name}-${randomName}${fileExtName}`);
          }

          if (req.url.includes('room')) {
            const folderName = './uploads/room';

            if (!fs.existsSync(folderName)) {
              fs.mkdirSync(folderName);
            }
            return callback(null, `room/${name}-${randomName}${fileExtName}`);
          }
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
  ],
  controllers: [RoomController],
  providers: [RoomService],
  exports: [RoomService],
})
export class RoomModule {}
