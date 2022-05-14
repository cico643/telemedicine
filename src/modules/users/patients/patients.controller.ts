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
import { Serialize } from '../../../common/interceptors/serialize.interceptor';
import { genericErrorHandler } from '../../../lib/genericErrorHandler';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { SignInUserDto } from '../dtos/sign-in-user.dto';
import { Patient } from '../entities/patient.entity';
import { UserRole } from '../entities/user.entity';
import { PatientsService } from './patients.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../lib/multerOptions';
import { Session as SessionType } from 'express-session';

@Serialize(CreatePatientDto)
@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(
    private patientsService: PatientsService,
    private readonly logger: Logger,
  ) {}

  @Get('/currentUser')
  @Roles(UserRole.Patient)
  async getCurrentUser(@CurrentUser() patient: Patient) {
    return patient;
  }

  @Post('/signout')
  async signout(@Session() session: SessionType) {
    session.context = null;
    session.destroy(null);
  }

  @Post('/signup')
  async createPatient(
    @Body() body: CreatePatientDto,
    @Session() session: SessionType,
  ) {
    try {
      const patient = await this.patientsService.register(body);
      session.context = {
        id: patient.id,
        email: patient.email,
        type: patient.type,
      };
      return patient;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: SignInUserDto, @Session() session: SessionType) {
    try {
      const patient = await this.patientsService.signin(
        body.email,
        body.password,
      );
      session.context = {
        id: patient.id,
        email: patient.email,
        type: patient.type,
      };
      return patient;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('avatar')
  @Roles(UserRole.Patient)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(201)
  async addAvatar(@Session() session: SessionType, @UploadedFile() file) {
    const avatar = await this.patientsService.addAvatar(
      session.context.id,
      file.buffer,
      file.originalname,
    );
    this.logger.log(
      `Avatar added [userId: ${session.context.id}]`,
      PatientsController.name,
    );
    return avatar;
  }

  @Delete('avatar')
  @Roles(UserRole.Patient)
  @HttpCode(204)
  async deleteAvatar(@Session() session: SessionType) {
    try {
      await this.patientsService.deleteAvatar(session.context.id);
      this.logger.log(
        `Avatar deleted [userId: ${session.context.id}]`,
        PatientsController.name,
      );
    } catch (err) {
      return genericErrorHandler(err);
    }
  }
}
