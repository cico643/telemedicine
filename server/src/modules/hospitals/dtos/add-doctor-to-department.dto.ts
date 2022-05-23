import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AddDoctorToDepartmentDto {
  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  doctorId: number;
}
