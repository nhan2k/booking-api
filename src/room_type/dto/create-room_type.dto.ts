import { IsNotEmpty } from 'class-validator';

export class CreateRoomTypeDto {
  @IsNotEmpty()
  prize: number;

  @IsNotEmpty()
  capacity: number;

  @IsNotEmpty()
  wifi: number;

  @IsNotEmpty()
  AC: number;

  @IsNotEmpty()
  heater: number;

  @IsNotEmpty()
  rating: number;

  //   @IsNotEmpty()
  //   other_facilities: string;

  @IsNotEmpty()
  room_id: number;
}
