import { IsNotEmpty } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  capacity: number;

  @IsNotEmpty()
  prize: number;

  @IsNotEmpty()
  facilities: string;

  @IsNotEmpty()
  hotel_id: number;

  @IsNotEmpty()
  roomTypes_id: number;
}
