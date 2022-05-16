import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Session,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { genericErrorHandler } from '../../../lib/genericErrorHandler';
import { UsersService } from '../services/users.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from '../../../lib/multerOptions';
import { Session as SessionType } from 'express-session';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { CreatePatientDiagnoseDto } from '../dtos/create-patient-diagnose.dto';

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

  @Post('/:id/patient-diagnoses')
  @HttpCode(201)
  @Roles(UserRole.Patient)
  async addPatientDiagnose(
    @Body() body: CreatePatientDiagnoseDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const patientDiagnose = await this.usersService.addPatientDiagnose(
        body,
        id,
      );

      this.logger.log(
        `Diagnose added for patient [userId: ${id}]`,
        UsersController.name,
      );

      return patientDiagnose;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:userId/patient-diagnoses')
  @HttpCode(200)
  async getPatientDiagnoses(@Param('userId', ParseIntPipe) id: number) {
    try {
      const patientDiagnoses = await this.usersService.getPatientDiagnoses(id);
      this.logger.log(
        `Fetched all diagnoses of patient [userId: ${id}]`,
        UsersController.name,
      );
      return patientDiagnoses;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:userId/patient-diagnoses/:diagnoseId')
  @HttpCode(200)
  async getPatientDiagnoseForGivenId(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('diagnoseId', ParseIntPipe) diagnoseId: number,
  ) {
    try {
      const patientDiagnoses =
        await this.usersService.getPatientDiagnoseForGivenId(diagnoseId);
      this.logger.log(
        `Fetched diagnose ${diagnoseId} of patient [userId: ${userId}]`,
        UsersController.name,
      );
      return patientDiagnoses;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Put('/:userId/patient-diagnoses/:diagnoseId/approval-status')
  @Roles(UserRole.Doctor, UserRole.Admin)
  @HttpCode(204)
  async approvePatientDiagnose(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('diagnoseId', ParseIntPipe) diagnoseId: number,
  ) {
    try {
      await this.usersService.approvePatientDiagnose(userId, diagnoseId);

      this.logger.log(
        `Patient Diagnose ${diagnoseId} is approved by the doctor [userId: ${userId}]`,
        UsersController.name,
      );
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Delete('/:userId/patient-diagnoses/:diagnoseId/approval-status')
  @Roles(UserRole.Doctor, UserRole.Admin)
  @HttpCode(204)
  async removeApprovalForPatientDiagnose(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('diagnoseId', ParseIntPipe) diagnoseId: number,
  ) {
    try {
      await this.usersService.removeApprovalForPatientDiagnose(
        userId,
        diagnoseId,
      );

      this.logger.log(
        `Approval of Patient Diagnose ${diagnoseId} is removed by the doctor [userId: ${userId}]`,
        UsersController.name,
      );
    } catch (err) {
      return genericErrorHandler(err);
    }
  }
}
