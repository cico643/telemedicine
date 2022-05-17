import { ApiProperty } from '@nestjs/swagger';
import { IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePatientDiagnoseDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  diagnoseId: number;

  @ApiProperty({ required: true })
  @IsISO8601() // YYYY-MM-DD date format
  @IsNotEmpty()
  startDate: string;
}
