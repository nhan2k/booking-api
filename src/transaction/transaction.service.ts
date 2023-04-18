import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';
import { STATUS } from './enum';
import axios from 'axios';
import { Paypal } from 'src/paypal/entities/paypal.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Paypal)
    private paypalRepository: Repository<Paypal>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      return await this.transactionRepository.save(createTransactionDto);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.transactionRepository.find({
      order: { updated_at: 'DESC' },
      relations: {
        __reservations__: true,
      },
    });
  }

  async adminFindAll() {
    return await this.transactionRepository.find({
      order: { updated_at: 'DESC' },
      relations: {
        __reservations__: true,
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.transactionRepository.findOneOrFail({
        where: { transaction_id: id },
        relations: {
          __reservations__: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    try {
      const paypal = await this.paypalRepository.findOne({
        where: {
          id: 1,
        },
      });
      const responsepaypal = await axios.get(
        `${process.env.PAYPAL_ENPOINT_TRANSACTION}/v2/checkout/orders/${updateTransactionDto.capture_id}`,
        {
          headers: {
            Authorization: `Bearer ${paypal.access_token}`,
          },
        },
      );

      const paypal_transaction_id =
        responsepaypal.data?.purchase_units?.[0]?.payments?.captures?.[0]?.id;

      let transaction = await this.findOne(id);

      let update = {
        ...transaction,
        status: STATUS.paid,
        paypal_transaction_id,
      };

      return await this.transactionRepository.save(update);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const transaction: Transaction = await this.findOne(id);

      return await this.transactionRepository.remove(transaction);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async refund(id: number) {
    try {
      let transaction = await this.findOne(id);
      const paypal = await this.paypalRepository.findOne({
        where: {
          id: 1,
        },
      });

      const response = await axios.post(
        `https://api-m.sandbox.paypal.com/v2/payments/captures/${transaction.paypal_transaction_id}/refund`,
        {
          amount: {
            value: transaction.amount,
            currency_code: 'USD',
          },
          invoice_id: new Date(),
          note_to_payer: `Refund for transaction ${transaction.transaction_id}`,
        },
        {
          headers: {
            Authorization: `Bearer ${paypal.access_token}`,
          },
        },
      );

      let update = {
        ...transaction,
        status: STATUS.refunded,
      };

      return await this.transactionRepository.save(update);
    } catch (error) {
      throw new HttpException(
        { message: (error as any)?.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
