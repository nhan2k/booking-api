import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { In, LessThan, MoreThan, Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';
import * as moment from 'moment';
import { STATUS } from 'src/transaction/enum';
import { STATUS as STATUS_RESERVE } from './enum/index';
import * as _ from 'lodash';
import { Paypal } from 'src/paypal/entities/paypal.entity';
import axios from 'axios';

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
    @InjectRepository(Paypal)
    private paypalRepository: Repository<Paypal>,
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
        order: { updated_at: 'DESC' },
        where: {
          __hotel__: {
            hotel_id: createReservationDto.hotel_id,
          },
          status: In(['pending', 'confirmed', 'completed']),
          check_in: LessThan(createReservationDto.checkout),
          checkout: MoreThan(createReservationDto.check_in),
        },
        transaction: true,
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
        updated_at: moment(new Date()).add(12, 'hours').toDate(),
        note: createReservationDto.room_id,
        status: STATUS_RESERVE.confirmed,
      };

      const newReservation = this.reservationRepository.create(formatData);
      const hotel = await this.hotelRepository.findOne({
        where: {
          hotel_id: formatData.hotel_id,
        },
        transaction: true,
      });
      const newTransaction = new Transaction();
      newTransaction.amount = formatData.balance_amount;
      newTransaction.status = STATUS.paid;

      const user = await this.userRepository.findOne({
        where: {
          user_id,
        },
        transaction: true,
      });
      const transaction = await this.transactionRepository.save(
        newTransaction,
        { transaction: true },
      );

      newReservation.__hotel__ = hotel;
      newReservation.__transactions__ = [newTransaction];
      newReservation.__user__ = user;

      await this.reservationRepository.save(newReservation, {
        transaction: true,
      });
      return transaction.transaction_id;
    } catch (error) {
      throw new HttpException(
        { message: error || 'Reservation Fail' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(
    user_id: number,
    filter: {
      pageSize?: number;
      pageNumber?: number;
    },
  ) {
    const { pageNumber, pageSize } = filter;

    const response = await this.reservationRepository.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      where: {
        __user__: {
          user_id,
        },
      },
      order: { updated_at: 'DESC' },
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
      return await this.reservationRepository.findOne({
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
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateReservationDto: UpdateReservationDto) {
    try {
      let reservation: Reservation = await this.reservationRepository.findOne({
        where: {
          reservation_id: id,
        },
      });

      let update = {
        ...reservation,
        status:
          reservation.status === STATUS_RESERVE.confirmed
            ? STATUS_RESERVE.pending
            : reservation.status === STATUS_RESERVE.pending
            ? STATUS_RESERVE.cancelled
            : STATUS_RESERVE.completed,
      };

      return await this.reservationRepository.save(update);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const hotel: Reservation = await this.findOne(id);

      return await this.reservationRepository.remove(hotel);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  // Admin
  async adminFindAll() {
    const response = await this.reservationRepository.find({
      order: { updated_at: 'DESC' },
      relations: {
        __hotel__: true,
        __transactions__: true,
        __user__: true,
      },
    });

    return response;
  }
}
