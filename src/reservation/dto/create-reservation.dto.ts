import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinDate,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReservationDto {
  @IsNotEmpty()
  guest_list: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  check_in?: Date;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  @MinDate(new Date())
  checkout: Date;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  balance_amount: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  hotel_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  transaction_id: number;

  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  user_id: number;
}
