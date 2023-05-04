import { Review } from 'src/review/entities/review.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';
import * as _ from 'lodash';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
  ) {}

  async create(createReviewDto: CreateReviewDto, user_id: number) {
    try {
      console.log(
        '🚀 ~ file: review.service.ts:53 ~ ReviewService ~ create ~ createReviewDto.room_type_id:',
        createReviewDto.room_type_id,
      );
      const reservation = await this.reservationRepository.findOne({
        where: {
          reservation_id: createReviewDto.reservation_id,
        },
      });
      if (!reservation) {
        throw new HttpException(
          { message: 'Not Found reservation' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.userRepository.findOne({
        where: {
          user_id,
        },
      });
      if (!user || user.role !== 'user') {
        throw new HttpException(
          { message: 'Not Found User' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const roomType = await this.roomTypeRepository.findOne({
        where: {
          room_type_id: createReviewDto.room_type_id,
        },
      });
      if (!roomType) {
        throw new HttpException(
          { message: 'Not Found roomType' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const newReview = this.reviewRepository.create({
        rating: createReviewDto.rating,
        description: createReviewDto.description,
      });
      newReview.__reservation__ = reservation;
      newReview.__user__ = user;
      newReview.__roomType__ = roomType;

      reservation.is_reviewed = true;
      await this.reservationRepository.save(reservation);

      const response = await this.reviewRepository.save(newReview);
      const allRatings = await this.reviewRepository.find({
        where: {
          __roomType__: {
            room_type_id: createReviewDto.room_type_id,
          },
        },
        select: {
          __roomType__: {
            rating: true,
          },
        },
      });

      const ratings = allRatings.map((review) => review.rating);
      const averageRating = _.mean(ratings);

      if (!isNaN(averageRating)) {
        if (averageRating - Math.floor(averageRating) > 0.5) {
          roomType.rating = Math.ceil(averageRating);
          await this.roomTypeRepository.save(roomType);
        } else {
          roomType.rating = Math.floor(averageRating);
          await this.roomTypeRepository.save(roomType);
        }
      }

      return response;
    } catch (error) {
      throw new HttpException(
        { message: `Create Review Fail! ${error}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(room_id: number) {
    try {
      return await this.reviewRepository.findAndCount({
        where: {
          __roomType__: {
            room_type_id: room_id,
          },
        },
        relations: {
          __user__: true,
        },
        order: {
          updated_at: 'DESC',
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: `Get Review Fail! ${error}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} review`;
  }

  update(id: number, updateReviewDto: UpdateReviewDto, user_id: number) {
    return `This action updates a #${id} review`;
  }

  remove(id: number, user_id: number) {
    return `This action removes a #${id} review`;
  }
}
