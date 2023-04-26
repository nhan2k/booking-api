import { IsNotEmpty } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  rating: number;

  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  room_type_id: number;

  @IsNotEmpty()
  reservation_id: number;
}
