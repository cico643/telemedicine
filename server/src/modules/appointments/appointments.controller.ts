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
import { AuthGuard } from '../../common/guards/auth.guard';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Session as SessionType } from 'express-session';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { genericErrorHandler } from 'src/lib/genericErrorHandler';
import { AddNoteDto } from './dtos/add-note.dto';
import { AddPrescriptionDto } from './dtos/add-prescription.dto';
import { AddDocumentDto } from './dtos/add-document.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/lib/multerOptions';

@Controller('appointments')
@ApiTags('appointments')
export class AppointmentsController {
  constructor(
    private readonly logger: Logger,
    private appointmentsService: AppointmentsService,
  ) {}

  @Get('/search/patients?')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async searchForPatientsOfDoctor(
    @Query('doctorId', ParseIntPipe) doctorId: number,
  ) {
    try {
      const patients = await this.appointmentsService.searchForPatientsOfDoctor(
        doctorId,
      );
      this.logger.log(
        `Fetched all patients of the doctor [doctorId: ${doctorId}]`,
        AppointmentsController.name,
      );
      return patients;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/search/doctor?')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async searchForBookedHoursOfDoctor(
    @Query('doctorId', ParseIntPipe) doctorId: number,
    @Query('date') date: string,
  ) {
    try {
      const bookedHours =
        await this.appointmentsService.searchForBookedHoursOfDoctor(
          doctorId,
          date,
        );
      this.logger.log(
        `Fetched all booked hours of the doctor [doctorId: ${doctorId}] on the given [date: ${date}]`,
        AppointmentsController.name,
      );
      return bookedHours;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/search?')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getAppointmentsOfGivenUser(
    @Query('type') type: string,
    @Query('id', ParseIntPipe) id: number,
  ) {
    try {
      const appointments =
        await this.appointmentsService.getAppointmentsOfGivenUser(id, type);
      this.logger.log(
        `Fetched all appointments of the user [userId: ${id}]`,
        AppointmentsController.name,
      );
      return appointments;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getAppointment(@Param('id') id: string) {
    try {
      const appointment = await this.appointmentsService.getAppointment(id);
      this.logger.log(
        `Fetched appointment [appointmentId: ${id}]`,
        AppointmentsController.name,
      );
      return appointment;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Put('/:id')
  @Roles(UserRole.Doctor)
  @HttpCode(200)
  async addNoteToAppointment(
    @Param('id') id: string,
    @Session() session: SessionType,
    @Body() body: AddNoteDto,
  ) {
    try {
      const appointment = await this.appointmentsService.addNoteToAppointment(
        id,
        session.context.id,
        body,
      );
      this.logger.log(
        `Note added for appointment [appointmentId: ${id}] by the doctor [doctorId: ${session.context.id}]`,
        AppointmentsController.name,
      );
      return appointment;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('/:id/prescriptions/')
  @Roles(UserRole.Doctor)
  @HttpCode(201)
  async addPrescription(
    @Body() body: AddPrescriptionDto,
    @Session() session: SessionType,
    @Param('id') id: string,
  ) {
    try {
      const prescription = await this.appointmentsService.addPrescription(
        body,
        session.context.id,
        id,
      );
      this.logger.log(
        `Prescription added by the doctor [userId: ${session.context.id}] to the appointment [appointmentId: ${id}]`,
        AppointmentsController.name,
      );
      return prescription;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/prescriptions/:prescriptionId')
  @HttpCode(200)
  async getPrescriptionOfGivenAppointment(
    @Param('prescriptionId') prescriptionId: string,
  ) {
    try {
      const prescription = await this.appointmentsService.getPrescription(
        prescriptionId,
      );
      this.logger.log(
        `Fetched prescription [prescriptionId: ${prescriptionId}]`,
        AppointmentsController.name,
      );
      return prescription;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('/:id/documents')
  @Roles(UserRole.Doctor)
  @HttpCode(201)
  async addDocument(
    @Body() body: AddDocumentDto,
    @Param('id') id: string,
    @Session() session: SessionType,
  ) {
    try {
      const appointment = await this.appointmentsService.addDocument(
        body,
        id,
        session.context.id,
      );
      this.logger.log(
        `Document added by user [userId: ${session.context.id}] for appointment [appointmentId: ${id}]`,
        AppointmentsController.name,
      );
      return appointment;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Put('/:appointmentId/documents/:documentId')
  @Roles(UserRole.Doctor)
  @UseInterceptors(FileInterceptor('file', multerOptions))
  @HttpCode(201)
  async addImageForDocument(
    @Session() session: SessionType,
    @UploadedFile() file,
    @Param('appointmentId') appointmentId: string,
    @Param('documentId', ParseIntPipe) documentId: number,
  ) {
    try {
      const image = await this.appointmentsService.addImageForDocument(
        session.context.id,
        file.buffer,
        file.originalname,
        documentId,
      );
      this.logger.log(
        `Image added for document [documentId: ${appointmentId}]`,
        AppointmentsController.name,
      );
      return image;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Delete('/:appointmentId/documents/:documentId')
  @Roles(UserRole.Doctor)
  @HttpCode(204)
  async deleteImageOfTheDocument(
    @Param('documentId', ParseIntPipe) documentId: number,
  ) {
    try {
      await this.appointmentsService.deleteImageOfTheDocument(documentId);
      this.logger.log(
        `Image deleted from the document [documentId: ${documentId}]`,
        AppointmentsController.name,
      );
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:appointmentId/documents')
  @UseGuards(AuthGuard)
  @HttpCode(200)
  async getDocumentsOfGivenAppointment(
    @Param('appointmentId') appointmentId: string,
  ) {
    try {
      const documents =
        await this.appointmentsService.getDocumentsOfGivenAppointment(
          appointmentId,
        );
      this.logger.log(
        `Fetched all documents of the appointment [appointmentId: ${appointmentId}]`,
        AppointmentsController.name,
      );
      return documents;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post()
  @Roles(UserRole.Admin, UserRole.Patient)
  @HttpCode(201)
  async addAppointment(
    @Body() body: CreateAppointmentDto,
    @Session() session: SessionType,
  ) {
    try {
      const appointment = await this.appointmentsService.addAppointment(body);
      this.logger.log(
        `Appointment added by user [userId: ${session.context.id}]`,
        AppointmentsController.name,
      );
      return appointment;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }
}
