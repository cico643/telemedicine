import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean, IsISO8601, IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePatientDiagnoseDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  @Expose()
  diagnoseId: number;

  @ApiProperty({ required: true })
  @IsISO8601() // YYYY-MM-DD date format
  @IsNotEmpty()
  @Expose()
  startDate: string;
}
