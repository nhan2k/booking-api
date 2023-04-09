import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

@Injectable()
export class ValidatorMiddleware implements NestMiddleware {
  private schema = z
    .object({
      first_name: z.string(),
      last_name: z.string(),
      email: z.string().email({ message: 'Invalid email address' }),
      phone_number: z.string(),
      location: z.string(),
    })
    .required();

  use(req: Request, res: Response, next: NextFunction) {
    try {
      this.schema.parse(JSON.parse(req.body.owner));

      console.log('Register Hotel');
      next();
    } catch (error) {
      console.error(JSON.stringify(error, null, 4));
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
  }
}
