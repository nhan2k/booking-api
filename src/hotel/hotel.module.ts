import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { HotelController } from './hotel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hotel } from './entities/hotel.entity';
import { ValidatorMiddleware } from './middlewares/validator.middleware';

@Module({
  imports: [TypeOrmModule.forFeature([Hotel])],
  controllers: [HotelController],
  providers: [HotelService],
})
export class HotelModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ValidatorMiddleware)
      .forRoutes(
        { path: 'hotel', method: RequestMethod.POST },
        { path: 'hotel', method: RequestMethod.PATCH },
      );
  }
}
