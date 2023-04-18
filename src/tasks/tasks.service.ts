import { Injectable, Logger } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import moment from 'moment';
import { Paypal } from 'src/paypal/entities/paypal.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { STATUS } from 'src/transaction/enum';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(Paypal)
    private paypalRepository: Repository<Paypal>,
  ) {}

  @Cron('0 0 * * *')
  async handleCronReservation() {
    console.log('Called at 12 pm every day');
    const noon = moment().startOf('day').add(12, 'hours').toDate();
    const transactions = await this.transactionRepository.find({
      where: {
        __reservations__: {
          check_in: LessThanOrEqual(noon),
          status: STATUS.paid,
        },
      },
    });
    await Promise.all(
      transactions.map(async (reserve) => {
        reserve.status = STATUS.completed;
        await this.transactionRepository.save(transactions);
      }),
    );
    return transactions;
  }

  @Cron('0 */8 * * *')
  async handleCronPaypalToken() {
    console.log('Called every 8 hours');
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET;
    const basicAuth = Buffer.from(`${clientId}:${secret}`).toString('base64');

    const response = await axios.post(
      `${process.env.PAYPAL_ENPOINT_TRANSACTION}/v1/oauth2/token`,
      {
        grant_type: 'client_credentials',
        ignoreCache: true,
        return_authn_schemes: true,
        return_client_metadata: true,
        return_unconsented_scopes: true,
      },
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${basicAuth}`,
        },
      },
    );
    const paypal = await this.paypalRepository.findOne({
      where: {
        id: 1,
      },
    });
    (paypal.access_token = response.data.access_token),
      await this.paypalRepository.save(paypal);
  }

  //   @Interval(10000)
  //   handleInterval() {
  //     this.logger.debug('Called every 10 seconds');
  //   }

  //   @Timeout(5000)
  //   handleTimeout() {
  //     this.logger.debug('Called once after 5 seconds');
  //   }
}
