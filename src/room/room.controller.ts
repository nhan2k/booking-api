import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
    @Body() createRoomDto: CreateRoomDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.roomService.create(createRoomDto, file);
  }

  @Get()
  findAll(@Request() req) {
    return this.roomService.findAll(req.user.userId);
  }

  @Get('/byHotel/:hotelId')
  findMyRooms(@Param('hotelId') id: number) {
    return this.roomService.findRoomsById(id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomService.update(+id, updateRoomDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roomService.remove(+id);
  }
}
