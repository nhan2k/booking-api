import { IsNotEmpty } from 'class-validator';

export class CreateHotelDto {
  @IsNotEmpty()
  hotel_name: string;

  @IsNotEmpty()
  location: string;

  @IsNotEmpty()
  owner: string;
}
