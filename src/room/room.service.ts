import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';
import { MoreThan, Repository } from 'typeorm';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { Room } from './entities/room.entity';
import * as _ from 'lodash';

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

  async create(
    createRoomDto: CreateRoomDto,
    file: Express.Multer.File,
  ): Promise<Room> {
    try {
      if (!file.path) {
        throw new HttpException(
          { message: 'Not Found IMG' },
          HttpStatus.BAD_REQUEST,
        );
      }
      const newRoom = new Room();
      newRoom.capacity = createRoomDto.capacity;
      newRoom.prize = createRoomDto.prize;
      newRoom.facilities = createRoomDto.facilities;
      newRoom.imgPath = file.path;

      const hotel = await this.hotelRepository.findOneOrFail({
        where: {
          hotel_id: createRoomDto.hotel_id,
        },
      });

      const roomTypes = new RoomType();
      roomTypes.capacity = createRoomDto.capacity;
      roomTypes.prize = createRoomDto.prize;
      roomTypes.AC = createRoomDto.AC;
      roomTypes.heater = createRoomDto.heater;
      roomTypes.other_facilities = createRoomDto.other_facilities;
      roomTypes.wifi = createRoomDto.wifi;
      await this.roomTypeRepository.save(roomTypes);

      newRoom.__hotel__ = hotel;
      (await newRoom.__roomTypes__).push(roomTypes);
      const roomSave = await this.roomRepository.save(newRoom);

      return roomSave;
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(user_id: number) {
    return await this.roomRepository.find({
      order: { created_at: 'DESC' },
      where: {
        __hotel__: {
          __user__: {
            user_id,
          },
        },
      },
      relations: {
        __hotel__: true,
        __roomTypes__: true,
      },
    });
  }

  async findAllAndFilter(filter: {
    endDate?: string;
    province?: string;
    startDate?: string;
    traveller?: number;
    pageSize?: number;
    pageNumber?: number;
  }) {
    const { pageNumber, pageSize } = filter;

    const formatFilter = _.pickBy(filter, (value) => value !== '');

    if (Object.keys(formatFilter).length > 2) {
      return await this.roomRepository.findAndCount({
        skip: (pageNumber - 1) * pageSize,
        take: pageSize,
        order: { created_at: 'DESC' },
        where: {
          __hotel__: {
            province: filter.province.length > 0 ? filter.province : '',
          },
          capacity: !isNaN(Number(filter.traveller))
            ? MoreThan(filter.traveller)
            : MoreThan(0),
        },
        relations: {
          __hotel__: true,
          __roomTypes__: true,
        },
      });
    }
    return await this.roomRepository.findAndCount({
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
      order: { created_at: 'DESC' },
      relations: {
        __hotel__: true,
        __roomTypes__: true,
      },
    });
  }

  async findRoomsById(hotel_id: number) {
    return await this.roomRepository.find({
      where: {
        __hotel__: {
          hotel_id,
        },
      },
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
          __hotel__: {
            __user__: true,
            __reservations__: true,
          },
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
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const room: Room = await this.findOne(id);

      return await this.roomRepository.remove(room);
    } catch (error) {
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
