import { validate } from 'class-validator';
import * as moment from 'moment';
import { CreateReservationDto } from './create-reservation.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export const reserveValidator = async (reserve: CreateReservationDto) => {
  const { check_in, checkout } = reserve;

  const now = moment();
  const checkInDate = moment(check_in);
  const checkOutDate = moment(checkout);

  if (!checkInDate.isSameOrAfter(now, 'day')) {
    console.error(JSON.stringify(error, null, 4));
    throw new HttpException(
      { message: 'Check-in date must be greater than or equal to today' },
      HttpStatus.BAD_REQUEST,
    );
  }

  if (!checkOutDate.isAfter(checkInDate, 'day')) {
    console.error(JSON.stringify(error, null, 4));
    throw new HttpException(
      { message: 'Check-out date must be greater than check-in date' },
      HttpStatus.BAD_REQUEST,
    );
  }

  return validate(reserve);
};
