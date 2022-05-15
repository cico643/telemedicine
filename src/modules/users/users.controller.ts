import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Post,
  Session,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../common/interceptors/serialize.interceptor';
import { genericErrorHandler } from './../../lib/genericErrorHandler';
import { Roles } from './../../common/decorators/roles.decorator';
import { CreateUserDto } from './dtos/create-user.dto';
import { SignInUserDto } from './dtos/sign-in-user.dto';
import { Patient } from './entities/patient.entity';
import { UserRole } from './entities/user.entity';
import { UsersService } from './users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './../../lib/multerOptions';
import { Session as SessionType } from 'express-session';

@Serialize(CreateUserDto)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Post('/signout')
  async signout(@Session() session: SessionType) {
    session.context = null;
    session.destroy(null);
  }

  @Post('/signup')
  async createUser(
    @Body() body: CreateUserDto,
    @Session() session: SessionType,
  ) {
    try {
      const user = await this.usersService.register(body);
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
      const user = await this.usersService.signin(body);
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

  @Post('avatar')
  @Roles(UserRole.Patient)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(201)
  async addAvatar(@Session() session: SessionType, @UploadedFile() file) {
    const avatar = await this.usersService.addAvatar(
      session.context.id,
      session.context.type,
      file.buffer,
      file.originalname,
    );
    this.logger.log(
      `Avatar added [userId: ${session.context.id}]`,
      UsersController.name,
    );
    return avatar;
  }

  @Delete('avatar')
  @Roles(UserRole.Patient)
  @HttpCode(204)
  async deleteAvatar(@Session() session: SessionType) {
    try {
      await this.usersService.deleteAvatar(
        session.context.id,
        session.context.type,
      );
      this.logger.log(
        `Avatar deleted [userId: ${session.context.id}]`,
        UsersController.name,
      );
    } catch (err) {
      return genericErrorHandler(err);
    }
  }
}
