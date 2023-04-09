import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

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
    const payload = { email: user.email, sub: user.user_id };
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
}
