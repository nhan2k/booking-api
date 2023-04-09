import {
  Controller,
  Get,
  Post,
  Query,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { UsersService } from './users/users.service';
import { RoomService } from './room/room.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private authService: AuthService,
    private readonly usersService: UsersService,
    private readonly roomService: RoomService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/rooms')
  findAll(
    @Query()
    filter: {
      endDate?: string;
      province?: string;
      startDate?: string;
      traveller?: number;
      pageSize?: number;
      pageNumber?: number;
    },
  ) {
    return this.roomService.findAllAndFilter(filter);
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/profile')
  getProfile(@Request() req) {
    return this.usersService.findOne(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/auth/refresh')
  getRefresh(@Request() req) {
    return this.authService.login(req.user);
  }
}
