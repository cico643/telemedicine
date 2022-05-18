import {
  Body,
  Controller,
  HttpCode,
  Logger,
  Post,
  Get,
  Session,
  Res,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { genericErrorHandler } from '../../lib/genericErrorHandler';
import { CreateUserDto } from '../users/dtos/create-user.dto';
import { SignInUserDto } from '../users/dtos/sign-in-user.dto';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Session as SessionType } from 'express-session';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logger: Logger,
  ) {}

  @Get('/me')
  @HttpCode(200)
  async me(@Session() session: SessionType) {
    return session.context;
  }

  @Post('/signout')
  @HttpCode(200)
  async signout(
    @Session() session: SessionType,
    @Res({ passthrough: true }) res: Response,
  ) {
    session.context = null;
    session.destroy(null);

    res.clearCookie('session_token');
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: SessionType,
  ) {
    try {
      const user = await this.authService.register(body);
      session.context = {
        id: user.id,
        email: user.email,
        type: user.type,
      };
      return user;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: SignInUserDto, @Session() session: SessionType) {
    try {
      const user = await this.authService.signin(body);
      session.context = {
        id: user.id,
        email: user.email,
        type: user.type,
      };
      return user;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }
}
