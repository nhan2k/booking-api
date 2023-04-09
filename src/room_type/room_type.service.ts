import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Repository } from 'typeorm';
import { CreateRoomTypeDto } from './dto/create-room_type.dto';
import { UpdateRoomTypeDto } from './dto/update-room_type.dto';
import { RoomType } from './entities/room_type.entity';

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectRepository(RoomType)
    private roomTypeRepository: Repository<RoomType>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  async create(createRoomTypeDto: CreateRoomTypeDto): Promise<RoomType> {
    try {
      const newRoomType = this.roomTypeRepository.create(createRoomTypeDto);

      const room = await this.roomRepository.findOneOrFail({
        where: {
          room_id: createRoomTypeDto.room_id,
        },
      });

      (await newRoomType.__rooms__).push(room);

      return await this.roomTypeRepository.save(newRoomType);
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll(): Promise<RoomType[]> {
    return await this.roomTypeRepository.find();
  }

  async findOne(id: number): Promise<RoomType> {
    try {
      return await this.roomTypeRepository.findOneOrFail({
        where: { room_type_id: id },
      });
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException(
        { message: 'Could not find entity' },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(
    id: number,
    updateRoomTypeDto: UpdateRoomTypeDto,
  ): Promise<RoomType> {
    try {
      const roomType = await this.findOne(id);

      const update = {
        ...roomType,
        ...updateRoomTypeDto,
      };

      return await this.roomTypeRepository.save(update);
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number): Promise<RoomType> {
    try {
      const roomType = await this.findOne(id);

      return await this.roomTypeRepository.remove(roomType);
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException({ message: error }, HttpStatus.BAD_REQUEST);
    }
  }
}
