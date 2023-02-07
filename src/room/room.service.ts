import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
    @InjectRepository(Hotel)
    private hotelRepository: Repository<Hotel>,
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<Room> {
    try {
      const newRoom = this.roomRepository.create(createRoomDto);

      const hotel = await this.hotelRepository.findOneOrFail({
        where: {
          hotel_id: createRoomDto.hotel_id,
        },
      });
      const roomTypes = await this.roomTypeRepository.findOneOrFail({
        where: {
          room_type_id: createRoomDto.roomTypes_id,
        },
      });

      newRoom.__hotel__ = hotel;
      (await newRoom.__roomTypes__).push(roomTypes);

      return await this.roomRepository.save(newRoom);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.roomRepository.find({
      relations: {
        __hotel__: true,
        __roomTypes__: true,
      },
    });
  }

  async findOne(id: number) {
    try {
      return await this.roomRepository.findOneOrFail({
        where: { room_id: id },
        relations: {
          __hotel__: true,
          __roomTypes__: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateRoomDto: UpdateRoomDto) {
    try {
      let room = await this.findOne(id);

      let update = {
        ...room,
        ...updateRoomDto,
      };

      return this.roomRepository.save(update);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      const room: Room = await this.findOne(id);

      return await this.roomRepository.remove(room);
    } catch (error) {
      throw new HttpException(
        { message: error.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
