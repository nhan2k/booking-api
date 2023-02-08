import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Reservation } from './entities/reservation.entity';

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

  async create(createReservationDto: CreateReservationDto) {
    try {
      const newReservation =
        this.reservationRepository.create(createReservationDto);
      const hotel = await this.hotelRepository.findOneOrFail({
        where: {
          hotel_id: createReservationDto.hotel_id,
        },
      });
      const transaction = await this.transactionRepository.findOneOrFail({
        where: {
          transaction_id: createReservationDto.transaction_id,
        },
      });
      const user = await this.userRepository.findOneOrFail({
        where: {
          user_id: createReservationDto.user_id,
        },
      });

      newReservation.__hotel__ = hotel;
      (await newReservation.__transactions__).push(transaction);
      newReservation.__user__ = user;

      return await this.reservationRepository.save(newReservation);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.reservationRepository.find({
      relations: {
        __hotel__: true,
        __transactions__: true,
        __user__: true,
      },
    });
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
}
