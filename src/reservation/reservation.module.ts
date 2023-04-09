import { Module, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { User } from 'src/users/entities/user.entity';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Transaction, Hotel, User])],
  controllers: [ReservationController],
  providers: [
    ReservationService,
    {
      provide: APP_PIPE,
      useFactory: (validationPipeOptions: ValidationPipeOptions) =>
        new ValidationPipe(validationPipeOptions),
      inject: [],
    },
  ],
})
export class ReservationModule {}
