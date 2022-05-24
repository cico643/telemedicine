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
  Query,
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
import { CreatePatientMedicationDto } from '../dtos/create-patient-medication.dto';
import { CreateRelativeDto } from '../dtos/create-relative.dto';

@UseGuards(AuthGuard)
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private readonly logger: Logger,
  ) {}

  @Get('/:id?')
  @HttpCode(200)
  async getUser(
    @Param('id', ParseIntPipe) id: number,
    @Query('type') type: string,
  ) {
    try {
      const targetRepository = this.usersService.findTargetRepository(type);
      const user = await this.usersService.findById(id, targetRepository);
      return user;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(201)
  async addAvatar(@Session() session: SessionType, @UploadedFile() file) {
    try {
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
    } catch (err) {
      return genericErrorHandler(err);
    }
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

  @Post('/:userId/patient-diagnoses?')
  @HttpCode(201)
  async addPatientDiagnose(
    @Body() body: CreatePatientDiagnoseDto,
    @Param('userId', ParseIntPipe) userId: number,
    @Query('type') type: string,
    @Session() session: SessionType,
  ) {
    try {
      const patientDiagnose = await this.usersService.addPatientDiagnose(
        body,
        userId,
        type,
        session.context.id,
      );

      this.logger.log(
        `Diagnose added for patient [userId: ${userId}]`,
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
      const patientDiagnose =
        await this.usersService.getPatientDiagnoseForGivenId(diagnoseId);
      this.logger.log(
        `Fetched diagnose ${diagnoseId} of patient [userId: ${userId}]`,
        UsersController.name,
      );
      return patientDiagnose;
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

  @Post('/:id/patient-medications')
  @HttpCode(201)
  @Roles(UserRole.Patient)
  async addPatientMedication(
    @Body() body: CreatePatientMedicationDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    try {
      const patientMedication = await this.usersService.addPatientMedication(
        body,
        id,
      );

      this.logger.log(
        `Medication added for patient [userId: ${id}]`,
        UsersController.name,
      );

      return patientMedication;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:userId/patient-medications')
  @HttpCode(200)
  async getPatientMedications(@Param('userId', ParseIntPipe) id: number) {
    try {
      const patientMedications = await this.usersService.getPatientMedications(
        id,
      );
      this.logger.log(
        `Fetched all medications of patient [userId: ${id}]`,
        UsersController.name,
      );
      return patientMedications;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:userId/patient-medications/:medicationId')
  @HttpCode(200)
  async getPatientMedicationForGivenId(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('medicationId', ParseIntPipe) medicationId: number,
  ) {
    try {
      const patientMedication =
        await this.usersService.getPatientMedicationForGivenId(medicationId);
      this.logger.log(
        `Fetched medication ${medicationId} of patient [userId: ${userId}]`,
        UsersController.name,
      );
      return patientMedication;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('/:userId/relatives')
  @HttpCode(201)
  @Roles(UserRole.Patient, UserRole.Admin)
  async addRelative(
    @Body() body: CreateRelativeDto,
    @Param('userId', ParseIntPipe) userId: number,
  ) {
    try {
      const relative = await this.usersService.addRelative(body, userId);

      this.logger.log(
        `Relative added for patient [userId: ${userId}]`,
        UsersController.name,
      );

      return relative;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:userId/relatives')
  @HttpCode(200)
  async getRelatives(@Param('userId', ParseIntPipe) userId: number) {
    try {
      const relatives = await this.usersService.getRelatives(userId);

      this.logger.log(
        `Fetched all relatives of [userId: ${userId}]`,
        UsersController.name,
      );

      return relatives;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:userId/relatives/:relativeId')
  @HttpCode(200)
  async getRelativeById(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('relativeId', ParseIntPipe) relativeId: number,
  ) {
    try {
      const relative = await this.usersService.getRelativeById(relativeId);

      this.logger.log(
        `Fetched relative for patient [userId: ${userId}]`,
        UsersController.name,
      );

      return relative;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }
}
