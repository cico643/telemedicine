import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreatePatientMedicationDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  medicationId: number;

  @ApiProperty({ required: true })
  @IsISO8601() // YYYY-MM-DD date format
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ required: true, nullable: true })
  @IsOptional()
  @IsISO8601() // YYYY-MM-DD date format
  endDate?: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  dailyDosage: number;
}
