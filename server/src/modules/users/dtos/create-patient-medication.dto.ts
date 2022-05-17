import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePatientMedicationDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  medicationId: number;
}
