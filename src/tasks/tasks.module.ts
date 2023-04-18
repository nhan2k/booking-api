import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { Paypal } from 'src/paypal/entities/paypal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Paypal])],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
