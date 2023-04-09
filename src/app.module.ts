import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { HotelModule } from './hotel/hotel.module';
import { RoomTypeModule } from './room_type/room_type.module';
import { RoomModule } from './room/room.module';
import { ReservationModule } from './reservation/reservation.module';
import { UsersModule } from './users/users.module';
import { TransactionModule } from './transaction/transaction.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import * as fs from 'fs';
import { LoggerMiddleware } from './logger.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: 'dpg-cge7ic82qv21ab3jjh30-a',
      username: 'booking_un5l_user',
      password: 'hCjUzY6Ox73D7ZRWLiCyvCrGuBwostL3',
      database: 'booking_un5l',
      entities: ['dist/**/*/*.entity.js'],
      synchronize: true,
      // ssl: true,
      // extra: {
      //   ssl: {
      //     rejectUnauthorized: false,
      //   },
      // },
    }),

    MulterModule.register({
      dest: './uploads',
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          console.log('🚀 ~ file: app.module.ts:45 ~ file:', file);
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

    HotelModule,
    RoomTypeModule,
    RoomModule,
    ReservationModule,
    UsersModule,
    TransactionModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
