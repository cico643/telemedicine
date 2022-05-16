import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PostgresErrorCode from 'src/providers/database/postgresErrorCodes.enum';
import { Repository } from 'typeorm';
import { CreateMedicationDto } from '../dtos/create-medication.dto';
import { Medication } from '../entities/medication.entity';

@Injectable()
export class MedicationsService {
  constructor(
    @InjectRepository(Medication)
    private medicationsRepository: Repository<Medication>,
  ) {}

  async addMedication(medicationDto: CreateMedicationDto) {
    try {
      const medication = await this.medicationsRepository.create(medicationDto);
      await this.medicationsRepository.save(medication);
      return medication;
    } catch (err) {
      if (err?.code === PostgresErrorCode.UniqueViolation)
        throw new HttpException(
          `Diagnose named ${medicationDto.name} already exists!`,
          HttpStatus.BAD_REQUEST,
        );
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getMedications() {
    return this.medicationsRepository.find();
  }

  getMedicationById(id: number) {
    return this.medicationsRepository.findOne(id);
  }

  deleteMedication(id: number) {
    return this.medicationsRepository.delete(id);
  }
}
