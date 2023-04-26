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
import { extname } from 'path';
import * as fs from 'fs';
import { LoggerMiddleware } from './logger.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './auth/role.guard';
import { PaypalModule } from './paypal/paypal.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      port: 5432,
      host: process.env.DB_HOST,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: ['dist/**/*/*.entity.js'],
      synchronize: true,
    }),
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
          console.log('🚀 ~ file: app.module.ts:68 ~ req.url:', req.url);
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
          if (req.url.includes('user')) {
            const folderName = './uploads/user';

            if (!fs.existsSync(folderName)) {
              fs.mkdirSync(folderName);
            }
            return callback(null, `user/${name}-${randomName}${fileExtName}`);
          }
          callback(null, `${name}-${randomName}${fileExtName}`);
        },
      }),
    }),
    ScheduleModule.forRoot(),
    HotelModule,
    RoomTypeModule,
    RoomModule,
    ReservationModule,
    UsersModule,
    TransactionModule,
    AuthModule,
    PaypalModule,
    TasksModule,
    ReviewModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
  configure(consumer: MiddlewareConsumer, app: any) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
