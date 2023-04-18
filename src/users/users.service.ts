import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOneAuth(email: string): Promise<any | undefined> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: number): Promise<any | undefined> {
    return this.userRepository.findOne({
      where: {
        user_id: id,
      },
    });
  }

  async register(createUserDto: CreateUserDto) {
    try {
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(createUserDto.password, salt);
      // Store hash in your password DB.
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: hash,
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      throw new HttpException(
        { message: 'Credential invalid email or phone' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findAll() {
    return this.userRepository.find({
      order: { updated_at: 'DESC' },
      relations: {
        __reservations__: true,
      },
    });
  }

  async findOne(user: any) {
    try {
      return await this.userRepository.findOne({
        where: { user_id: user.userId },
        select: ['email', 'first_name', 'last_name', 'location', 'role'],
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
      const user: User = await this.findOne(id);

      const update = {
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
