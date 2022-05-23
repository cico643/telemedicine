import { ApiProperty } from '@nestjs/swagger';
import {
  IsISO8601,
  IsMilitaryTime,
  IsNotEmpty,
  IsNumber,
} from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  doctorId: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({ required: true })
  @IsISO8601() // YYYY-MM-DD date format
  @IsNotEmpty()
  date: string;

  @ApiProperty({ required: true })
  @IsMilitaryTime() // HH:MM time format
  @IsNotEmpty()
  startHour: string;
}
