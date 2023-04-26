import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone_number: string;

  @IsNotEmpty()
  location: string;
}
