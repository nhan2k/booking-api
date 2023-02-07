import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Room, Hotel, RoomType])],
  controllers: [RoomController],
  providers: [RoomService],
})
export class RoomModule {}
