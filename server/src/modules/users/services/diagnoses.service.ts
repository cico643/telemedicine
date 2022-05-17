import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from '../../../providers/database/postgresErrorCodes.enum';
import { Repository } from 'typeorm';
import { CreateDiagnoseDto } from '../dtos/create-diagnose.dto';
import { Diagnose } from '../entities/diagnose.entity';
@Injectable()
export class DiagnosesService {
  constructor(
    @InjectRepository(Diagnose)
    private diagnosesRepository: Repository<Diagnose>,
  ) {}

  async addDiagnose(diagnoseDto: CreateDiagnoseDto) {
    try {
      const diagnose = await this.diagnosesRepository.create(diagnoseDto);
      await this.diagnosesRepository.save(diagnose);
      return diagnose;
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation)
        throw new HttpException(
          `Diagnose named ${diagnoseDto.name} already exists!`,
          HttpStatus.BAD_REQUEST,
        );
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getDiagnoses() {
    return this.diagnosesRepository.find();
  }

  getDiagnoseById(id: number) {
    return this.diagnosesRepository.findOne(id);
  }

  deleteDiagnose(id: number) {
    return this.diagnosesRepository.delete(id);
  }
}
