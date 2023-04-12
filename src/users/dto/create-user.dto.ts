import { IsEmail, IsNotEmpty, IsPhoneNumber, Min } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  first_name: string;

  @IsNotEmpty()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN')
  phone_number: string;

  @IsNotEmpty()
  location: string;

  role: string;
}
