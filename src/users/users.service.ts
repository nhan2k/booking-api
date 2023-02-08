import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);

      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  findAll() {
    return this.userRepository.find({
      relations: {
        __reservations__: true,
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.userRepository.findOneOrFail({
        where: { user_id: id },
        relations: {
          __reservations__: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    try {
      let user = await this.findOne(id);

      let update = {
        ...user,
        ...updateUserDto,
      };

      return await this.userRepository.save(update);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const user = await this.findOne(id);

      return await this.userRepository.remove(user);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
