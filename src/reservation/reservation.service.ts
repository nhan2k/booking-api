import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { LessThan, MoreThan, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import * as moment from 'moment';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createReservationDto: CreateReservationDto, user_id: number) {
    try {
      if (moment(createReservationDto.check_in).isBefore(moment())) {
        throw new HttpException(
          { message: 'Reservation checkin must be better or equal than today' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const checkReservation = await this.reservationRepository.find({
        where: {
          __hotel__: {
            hotel_id: createReservationDto.hotel_id,
          },
          check_in: LessThan(createReservationDto.checkout),
          checkout: MoreThan(createReservationDto.check_in),
        },
      });

      if (checkReservation.length > 0) {
        throw new HttpException(
          { message: 'Reservation is exists' },
          HttpStatus.BAD_REQUEST,
        );
      }

      const formatData = {
        ...createReservationDto,
        check_in: moment(createReservationDto.check_in)
          .add(12, 'hours')
          .toDate(),
        checkout: moment(createReservationDto.checkout)
          .add(12, 'hours')
          .toDate(),
        created_at: moment(new Date()).add(12, 'hours').toDate(),
      };

      const newReservation = this.reservationRepository.create(formatData);
      const hotel = await this.hotelRepository.findOneOrFail({
        where: {
          hotel_id: formatData.hotel_id,
        },
      });
      const transaction = new Transaction();
      transaction.amount = formatData.balance_amount;

      const user = await this.userRepository.findOneOrFail({
        where: {
          user_id,
        },
      });

      newReservation.__hotel__ = hotel;
      (await newReservation.__transactions__).push(transaction);
      newReservation.__user__ = user;

      return await this.reservationRepository.save(newReservation);
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(user_id: number) {
    if (!user_id) {
      throw new HttpException(
        { message: 'Could not find user' },
        HttpStatus.BAD_REQUEST,
      );
    }
    const response = await this.reservationRepository.find({
      where: {
        __user__: {
          user_id: user_id,
        },
      },
      order: { created_at: 'DESC' },
      relations: {
        __hotel__: true,
        __transactions__: true,
        __user__: true,
      },
    });

    return response;
  }

  async findOne(id: number) {
    try {
      return await this.reservationRepository.findOneOrFail({
        where: {
          reservation_id: id,
        },
        relations: {
          __hotel__: true,
          __transactions__: true,
          __user__: true,
        },
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      let reservation: Reservation = await this.findOne(id);

      let update = {
        ...reservation,
        ...updateReservationDto,
      };

      return await this.reservationRepository.save(update);
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const hotel: Reservation = await this.findOne(id);

      return await this.reservationRepository.remove(hotel);
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
