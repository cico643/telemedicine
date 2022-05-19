import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePatientMedicationDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  medicationId: number;

  @ApiProperty({ required: true })
  @IsISO8601() // YYYY-MM-DD date format
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ required: true })
  @IsISO8601() // YYYY-MM-DD date format
  @IsNotEmpty()
  endDate: string;
}
