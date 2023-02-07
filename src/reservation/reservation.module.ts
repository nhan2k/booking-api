import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Transaction, Hotel, User])],
  controllers: [ReservationController],
  providers: [ReservationService],
})
export class ReservationModule {}
