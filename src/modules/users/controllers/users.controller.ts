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
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from '../../../common/interceptors/serialize.interceptor';
import { genericErrorHandler } from '../../../lib/genericErrorHandler';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../lib/multerOptions';
import { Session as SessionType } from 'express-session';
import { AuthGuard } from 'src/common/guards/auth.guard';

@Serialize(CreateUserDto)
@UseGuards(AuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Post('avatar')
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
