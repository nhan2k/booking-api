import { IsNotEmpty } from 'class-validator';

export class CreateRoomTypeDto {
  @IsNotEmpty()
  prize: number;

  @IsNotEmpty()
  capacity: number;

  @IsNotEmpty()
  wifi: boolean;

  @IsNotEmpty()
  AC: boolean;

  @IsNotEmpty()
  heater: boolean;

  @IsNotEmpty()
  rating: number;

  //   @IsNotEmpty()
  //   other_facilities: string;

  @IsNotEmpty()
  room_id: number;
}
