import { IsDateString, IsNotEmpty } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  guest_list: number;

  @IsNotEmpty()
  @IsDateString()
  check_in: Date;

  @IsNotEmpty()
  @IsDateString()
  checkout: Date;

  @IsNotEmpty()
  balance_amount: number;

  @IsNotEmpty()
  hotel_id: number;

  @IsNotEmpty()
  room_id: number;
}
