import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesService } from '../../providers/s3/files.service';
import { Repository } from 'typeorm';
import { Doctor } from '../users/entities/doctor.entity';
import { Patient } from '../users/entities/patient.entity';
import { UsersService } from '../users/services/users.service';
import { AddDocumentDto } from './dtos/add-document.dto';
import { AddNoteDto } from './dtos/add-note.dto';
import { AddPrescriptionDto } from './dtos/add-prescription.dto';
import { CreateAppointmentDto } from './dtos/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';
import { Document } from './entities/document.entity';
import { Prescription } from './entities/prescription.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentsRepository: Repository<Appointment>,
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    @InjectRepository(Prescription)
    private prescriptionsRepository: Repository<Prescription>,
    private usersService: UsersService,
    private filesService: FilesService,
  ) {}

  async addAppointment(createAppointmentDto: CreateAppointmentDto) {
    const doctor = (await this.usersService.findById(
      createAppointmentDto.doctorId,
      this.usersService.findTargetRepository('doctor'),
    )) as Doctor;
    const patient = (await this.usersService.findById(
      createAppointmentDto.patientId,
      this.usersService.findTargetRepository('patient'),
    )) as Patient;
    const appointment = await this.appointmentsRepository.create({
      doctor,
      patient,
      startHour: createAppointmentDto.startHour,
      date: createAppointmentDto.date,
    });
    await this.appointmentsRepository.save(appointment);
    return appointment;
  }

  async getAppointmentsOfGivenUser(id: number, type: string) {
    const findOptions =
      type === 'doctor'
        ? {
            where: {
              doctor: id,
            },
          }
        : {
            where: {
              patient: id,
            },
          };
    const appointments = await this.appointmentsRepository.find(findOptions);
    return appointments;
  }

  async getAppointment(id: number) {
    const appointment = await this.appointmentsRepository.findOne(id);
    return appointment;
  }

  async addNoteToAppointment(id: number, doctorId: number, body: AddNoteDto) {
    const appointment = await this.appointmentsRepository.findOne(id);
    if (appointment.doctor.id !== doctorId) {
      throw new HttpException(
        "Note can only be added by the appointment's respective doctor",
        HttpStatus.BAD_REQUEST,
      );
    }
    appointment.note = body.note;
    await this.appointmentsRepository.save(appointment);
    return appointment;
  }

  async addPrescription(
    addPrescriptionDto: AddPrescriptionDto,
    doctorId: number,
    appointmentId: number,
  ) {
    const appointment = await this.appointmentsRepository.findOne(
      appointmentId,
    );
    if (appointment.doctor.id !== doctorId) {
      throw new HttpException(
        "Prescription can only be added by the appointment's respective doctor",
        HttpStatus.BAD_REQUEST,
      );
    }
    const prescription = await this.prescriptionsRepository.create({
      content: addPrescriptionDto.content,
      appointment,
    });
    await this.prescriptionsRepository.save(prescription);
    return prescription;
  }

  async getPrescription(prescriptionId: number) {
    const prescription = await this.prescriptionsRepository.findOne(
      prescriptionId,
    );
    return prescription;
  }

  async addDocument(
    addDocumentDto: AddDocumentDto,
    id: number,
    doctorId: number,
  ) {
    const appointment = await this.appointmentsRepository.findOne(id, {
      relations: ['doctor'],
    });
    if (appointment.doctor.id !== doctorId) {
      throw new HttpException(
        "Documents can only be added by the appointment's respective doctor",
        HttpStatus.BAD_REQUEST,
      );
    }
    const document = await this.documentsRepository.create({
      name: addDocumentDto.name,
      appointment,
    });
    await this.documentsRepository.save(document);
    return document;
  }

  async addImageForDocument(
    id: number,
    imageBuffer: Buffer,
    filename: string,
    documentId: number,
  ) {
    const image = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    const document = await this.documentsRepository.findOne(documentId);
    await this.documentsRepository.update(documentId, {
      ...document,
      image,
    });
    return image;
  }

  async deleteImageOfTheDocument(documentId: number) {
    const document = await this.documentsRepository.findOne(documentId);
    const fileId = document.image?.id;
    if (fileId) {
      await this.documentsRepository.update(documentId, {
        ...document,
        image: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }

  async getDocumentsOfGivenAppointment(appointmentId: number) {
    const appointment = await this.appointmentsRepository.findOne(
      appointmentId,
      {
        relations: ['documents'],
      },
    );
    return appointment.documents;
  }

  async searchForBookedHoursOfDoctor(doctorId: number, date: string) {
    const result = await this.appointmentsRepository
      .createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.doctor', 'doctor')
      .where('doctor.id = :doctorId', { doctorId })
      .andWhere('appointment.date = :date', { date })
      .select('appointment.startHour')
      .getMany();
    return result.map((e) => e.startHour);
  }
}
