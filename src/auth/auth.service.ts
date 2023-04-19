import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

interface ITokenPayload {
  email: string;
  sub: number;
  role: string;
}
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneAuth(email);
    if (!user) {
      throw new HttpException(
        { reason: 'Not found user' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Load hash from your password DB.
    const isValid = bcrypt.compareSync(pass, user.password); // true
    if (isValid) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.user_id, role: user.role };
    const { user_id, password, created_at, updated_at, deleted_at, ...rest } =
      user;

    const options: JwtSignOptions = {
      expiresIn: '7d',
    };
    const optionsRefresh: JwtSignOptions = {
      expiresIn: '14d',
    };
    return {
      access_token: this.jwtService.sign(payload, options),
      refresh_token: this.jwtService.sign(payload, optionsRefresh),
      user: rest,
    };
  }

  async generateAccessToken(payload: ITokenPayload): Promise<string> {
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }

  async generateRefreshToken(payload: ITokenPayload): Promise<string> {
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME,
    });
    return refreshToken;
  }

  async verifyAccessToken(token: string): Promise<ITokenPayload> {
    const payload = await this.jwtService.verifyAsync(token);
    return payload;
  }

  async verifyRefreshToken(token: string): Promise<ITokenPayload> {
    const payload = await this.jwtService.verifyAsync(token);
    return payload;
  }

  async refreshToken(refreshTokenDto: { refreshToken: string }): Promise<any> {
    const token = await this.verifyRefreshToken(refreshTokenDto.refreshToken);

    if (!token) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(token.sub);

    if (!user) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const payload: ITokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.roles,
    };
    const options: JwtSignOptions = {
      expiresIn: '7d',
    };
    const optionsRefresh: JwtSignOptions = {
      expiresIn: '14d',
    };
    const access_token = this.jwtService.sign(payload, options);
    const refresh_token = this.jwtService.sign(payload, optionsRefresh);

    return { access_token, refresh_token };
  }
}
