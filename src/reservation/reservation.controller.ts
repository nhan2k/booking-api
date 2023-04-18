import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { reserveValidator } from './dto/date-validate.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Request() req,
  ) {
    await reserveValidator(createReservationDto);

    return this.reservationService.create(
      createReservationDto,
      req.user.userId,
    );
  }

  @Get()
  findAll(@Request() req) {
    return this.reservationService.findAll(req.user.userId);
  }

  // Admin
  @Get('/admin')
  async getAll() {
    return await this.reservationService.adminFindAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    // await reserveValidator(updateReservationDto);
    return this.reservationService.update(+id, updateReservationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.reservationService.remove(+id);
  }
}
