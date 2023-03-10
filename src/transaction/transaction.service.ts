import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    try {
      const newTransaction =
        this.transactionRepository.create(createTransactionDto);

      return await this.transactionRepository.save(newTransaction);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.transactionRepository.find({
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
      let transaction = await this.findOne(id);

      let update = {
        ...transaction,
        ...updateTransactionDto,
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
}
