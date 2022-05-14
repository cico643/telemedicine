import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { Patient } from '../entities/patient.entity';
import * as bcrypt from 'bcrypt';
import { FilesService } from 'src/providers/s3/files.service';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient) private patientsRepository: Repository<Patient>,
    private readonly filesService: FilesService,
  ) {}

  public async register(patientDto: CreatePatientDto) {
    const hashedPassword = await bcrypt.hash(patientDto.password, 10);
    try {
      const createdPatient = await this.create({
        ...patientDto,
        password: hashedPassword,
      });
      return createdPatient;
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

  public async signin(email: string, password: string) {
    try {
      const patient = await this.getByEmail(email);

      const isValidPassword = await bcrypt.compare(password, patient.password);
      if (!isValidPassword) {
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      }
      return patient;
    } catch (error) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
  }

  async getByEmail(email: string) {
    const user = this.patientsRepository.findOne({ email });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with a given email is not found!');
  }

  async findById(id: number) {
    if (!id) {
      return null;
    }
    return this.patientsRepository.findOne(id);
  }

  async create(patientData: CreatePatientDto) {
    const patient = await this.patientsRepository.create(patientData);
    await this.patientsRepository.save(patient);
    return patient;
  }

  public async addAvatar(id: number, imageBuffer: Buffer, filename: string) {
    const avatar = await this.filesService.uploadPublicFile(
      imageBuffer,
      filename,
    );
    const user = await this.findById(id);
    await this.patientsRepository.update(id, {
      ...user,
      avatar,
    });
    return avatar;
  }

  public async deleteAvatar(id: number) {
    const user = await this.findById(id);
    const fileId = user.avatar?.id;
    if (fileId) {
      await this.patientsRepository.update(id, {
        ...user,
        avatar: null,
      });
      await this.filesService.deletePublicFile(fileId);
    }
  }
}
