import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(
    createHotelDto: CreateHotelDto,
    user: any,
    file: Express.Multer.File,
  ): Promise<Hotel> {
    try {
      if (!file.path) {
        throw new HttpException(
          { message: 'Not Found IMG' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const newHotel = this.hotelsRepository.create({
        ...createHotelDto,
        imgPath: file.path,
      });

      const userFind = await this.usersRepository.findOne({
        where: {
          user_id: user.userId,
        },
      });
      if (!userFind) {
        throw new HttpException(
          { message: 'Not Found User' },
          HttpStatus.BAD_REQUEST,
        );
      }
      newHotel.__user__ = userFind;
      return await this.hotelsRepository.save(newHotel);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<Hotel[]> {
    return await this.hotelsRepository.find({
      order: { updated_at: 'DESC' },
      relations: {
        __reservations__: true,
        rooms: true,
      },
    });
  }

  async findOne(id: number): Promise<Hotel> {
    try {
      return await this.hotelsRepository.findOneOrFail({
        where: { hotel_id: id },
        relations: {
          __reservations__: true,
          rooms: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findMyHotel(user: any): Promise<Hotel[]> {
    try {
      return await this.hotelsRepository.find({
        order: { updated_at: 'DESC' },
        where: {
          __user__: {
            user_id: user.userId,
          },
        },
        relations: {
          __reservations__: true,
          rooms: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findMyHotelById(user: any, hotel_id: number): Promise<Hotel> {
    try {
      return await this.hotelsRepository.findOne({
        where: {
          __user__: {
            user_id: user.userId,
          },
          hotel_id: hotel_id,
        },
        relations: {
          __reservations__: true,
          rooms: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    try {
      let hotel = await this.findOne(id);

      let update = {
        ...hotel,
        ...updateHotelDto,
      };

      return await this.hotelsRepository.save(update);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<Hotel> {
    try {
      const hotel: Hotel = await this.findOne(id);

      return await this.hotelsRepository.remove(hotel);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
