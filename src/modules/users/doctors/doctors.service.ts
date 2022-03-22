import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';
import { Doctor } from '../entities/doctor.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DoctorsService {
  constructor(
    @InjectRepository(Doctor) private doctorsRepository: Repository<Doctor>,
  ) {}

  public async register(doctorDto: CreateDoctorDto) {
    const hashedPassword = await bcrypt.hash(doctorDto.password, 10);
    try {
      const createdDoctor = await this.create({
        ...doctorDto,
        password: hashedPassword,
      });
      return createdDoctor;
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
      const doctor = await this.getByEmail(email);

      const isValidPassword = await bcrypt.compare(password, doctor.password);
      if (!isValidPassword) {
        throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
      }
      return doctor;
    } catch (error) {
      throw new HttpException('Invalid Credentials', HttpStatus.BAD_REQUEST);
    }
  }

  create(doctorDto: CreateDoctorDto) {
    const doctor = this.doctorsRepository.create(doctorDto);
    this.doctorsRepository.save(doctor);
    return doctor;
  }

  async getByEmail(emaill: string) {
    const user = this.doctorsRepository.findOne({ emaill });
    if (user) {
      return user;
    }
    throw new NotFoundException('User with a given email is not found!');
  }
}
