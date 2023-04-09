import { Module } from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
@Module({
  imports: [
    TypeOrmModule.forFeature([Hotel, User]),
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
          if (req.url.includes('hotel')) {
            const folderName = './uploads/hotel';

            if (!fs.existsSync(folderName)) {
              fs.mkdirSync(folderName);
            }
            return callback(null, `hotel/${name}-${randomName}${fileExtName}`);
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
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule {}
