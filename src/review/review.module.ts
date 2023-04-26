import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './entities/review.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, User, Reservation, RoomType])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
