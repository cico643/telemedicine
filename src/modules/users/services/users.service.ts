import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Patient } from '../entities/patient.entity';
import * as bcrypt from 'bcrypt';
import { FilesService } from '../../../providers/s3/files.service';
import { Doctor } from '../entities/doctor.entity';
import { Admin } from '../entities/admin.entity';
import PostgresErrorCode from 'src/providers/database/postgresErrorCodes.enum';
import { CreatePatientDiagnoseDto } from '../dtos/create-patient-diagnose.dto';
import { PatientDiagnose } from '../entities/patientDiagnose.entity';
import { Diagnose } from '../entities/diagnose.entity';
import { DiagnosesService } from './diagnoses.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Patient) private patientsRepository: Repository<Patient>,
    @InjectRepository(Doctor) private doctorsRepository: Repository<Patient>,
    @InjectRepository(Admin) private adminsRepository: Repository<Admin>,
    @InjectRepository(PatientDiagnose)
    private patientDiagnoseRepository: Repository<PatientDiagnose>,
    @InjectRepository(Diagnose)
    private diagnoseRepository: Repository<Diagnose>,
    private readonly diagnosesService: DiagnosesService,
    private readonly filesService: FilesService,
  ) {}

  public async register(userDto: CreateUserDto) {
    const targetRepository =
      userDto.type === 'doctor'
        ? this.doctorsRepository
        : userDto.type === 'patient'
        ? this.patientsRepository
        : this.adminsRepository;
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    try {
      const createdUser = await this.create(
        {
          ...userDto,
          password: hashedPassword,
        },
        targetRepository,
      );
      return createdUser;
    } catch (error) {
      if (error?.code === PostgresErrorCode.UniqueViolation) {
        throw new HttpException(
          'User with that email already exists',
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  public async signin({ email, password, type }) {
    try {
      const targetRepository =
        type === 'doctor'
          ? this.doctorsRepository
          : type === 'patient'
          ? this.patientsRepository
          : this.adminsRepository;
      const user = await this.getByEmail(email, targetRepository);

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      }
      return user;
    } catch (error) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async getByEmail(
    email: string,
    targetRepository: Repository<Doctor | Patient | Admin>,
  ) {
    const user = targetRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with a given email is not found!');
  }

  async findById(
    id: number,
    targetRepository: Repository<Doctor | Patient | Admin>,
  ) {
    if (!id) {
      return null;
    }
    return targetRepository.findOne(id);
  }

  async create(
    userData: CreateUserDto,
    targetRepository: Repository<Doctor | Patient | Admin>,
  ) {
    const user = await targetRepository.create(userData);
    await targetRepository.save(user);
    return user;
  }

  public async addAvatar(
    id: number,
    type: string,
    imageBuffer: Buffer,
    filename: string,
  ) {
    const targetRepository =
      type === 'doctor'
        ? this.doctorsRepository
        : type === 'patient'
        ? this.patientsRepository
        : this.adminsRepository;
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    const user = await this.findById(id, targetRepository);
    await targetRepository.update(id, {
      ...user,
      avatar,
    });
    return avatar;
  }

  public async deleteAvatar(id: number, type: string) {
    const targetRepository =
      type === 'doctor'
        ? this.doctorsRepository
        : type === 'patient'
        ? this.patientsRepository
        : this.adminsRepository;
    const user = await this.findById(id, targetRepository);
    const fileId = user.avatar?.id;
    if (fileId) {
      await targetRepository.update(id, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }

  public async addPatientDiagnose(
    patientDiagnoseDto: CreatePatientDiagnoseDto,
    id: number,
  ) {
    const diagnose = await this.diagnosesService.getDiagnoseById(
      patientDiagnoseDto.diagnoseId,
    );
    const patient = await this.findById(id, this.patientsRepository);
    const patientDiagnose = await this.patientDiagnoseRepository.create({
      startDate: patientDiagnoseDto.startDate,
      patient,
      diagnose,
    });
    await this.patientDiagnoseRepository.save(patientDiagnose);
    return patientDiagnose;
  }

  public async getPatientDiagnoses(id: number) {
    const patientDiagnoses = await this.patientDiagnoseRepository.find({
      where: { patient: id },
      relations: ['patient'],
    });

    return patientDiagnoses;
  }

  public async getPatientDiagnoseForGivenId(diagnoseId) {
    const patientDiagnose = await this.patientDiagnoseRepository.findOne(
      diagnoseId,
    );
    return patientDiagnose;
  }

  public async approvePatientDiagnose(userId, diagnoseId) {
    const patientDiagnose = await this.getPatientDiagnoseForGivenId(diagnoseId);
    if (!patientDiagnose) {
      throw new NotFoundException('patientDiagnose not found');
    }

    patientDiagnose.approved = true;
    patientDiagnose.doctor = await this.findById(
      userId,
      this.doctorsRepository,
    );
    await this.patientDiagnoseRepository.save(patientDiagnose);
  }

  public async removeApprovalForPatientDiagnose(userId, diagnoseId) {
    const patientDiagnose = await this.patientDiagnoseRepository.findOne(
      diagnoseId,
      { relations: ['doctor'] },
    );
    if (patientDiagnose.doctor.id !== userId) {
      throw new BadRequestException(
        `Only the owner of the approvement can remove their approval and the [userId: ${userId}] is not the owner`,
      );
    }
    patientDiagnose.approved = false;
    patientDiagnose.doctor = null;
    await this.patientDiagnoseRepository.save(patientDiagnose);
  }
}
