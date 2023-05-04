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
  UseInterceptors,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { HotelService } from './hotel.service';
import { CreateHotelDto } from './dto/create-hotel.dto';
import { UpdateHotelDto } from './dto/update-hotel.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('hotel')
export class HotelController {
  constructor(private readonly hotelService: HotelService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createHotelDto: CreateHotelDto,
    @Request() req,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.hotelService.create(createHotelDto, req.user, file);
  }

  @Get()
  async findAll() {
    return await this.hotelService.findAll();
  }

  @Get('my')
  async findMyHotel(
    @Request() req,
    @Query()
    filter: {
      pageSize?: number;
      pageNumber?: number;
    },
  ) {
    return await this.hotelService.findMyHotel(req.user.userId, filter);
  }

  @Get('my/:hotel_id')
  async findMyHotelById(@Request() req, @Param('hotel_id') hotel_id: number) {
    return await this.hotelService.findMyHotelById(req.user.userId, hotel_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.hotelService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateHotelDto: UpdateHotelDto,
  ) {
    return await this.hotelService.update(+id, updateHotelDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.hotelService.remove(+id);
  }
}
