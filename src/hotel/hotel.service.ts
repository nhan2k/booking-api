import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { Hotel } from './entities/hotel.entity';

@Injectable()
export class HotelService {
  constructor(
    @InjectRepository(Hotel)
    private hotelsRepository: Repository<Hotel>,
  ) {}

  async create(createHotelDto: CreateHotelDto): Promise<Hotel> {
    try {
      const newHotel = this.hotelsRepository.create(createHotelDto);

      return await this.hotelsRepository.save(newHotel);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(): Promise<Hotel[]> {
    return await this.hotelsRepository.find({
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

  async update(id: number, updateHotelDto: UpdateHotelDto): Promise<Hotel> {
    try {
      let hotel = await this.findOne(id);

      let update = {
        ...hotel,
        ...updateHotelDto,
      };

      return await this.hotelsRepository.save(update);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number): Promise<Hotel> {
    try {
      const hotel: Hotel = await this.findOne(id);

      return await this.hotelsRepository.remove(hotel);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
