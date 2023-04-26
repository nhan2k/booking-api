import { Review } from 'src/review/entities/review.entity';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';

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
      if (!user) {
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
      return await this.reviewRepository.save(newReview);
    } catch (error) {
      throw new HttpException(
        { message: `Create Review Fail! ${error}` },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(room_id: number) {
    return await this.reviewRepository.findAndCount({
      where: {
        __roomType__: {
          __room__: {
            room_id,
          },
        },
      },
      relations: {
        __user__: true,
      },
    });
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
