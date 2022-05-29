import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

interface IPrescriptionMedications {
  signatura: string;
  medicationId: number;
}

export class AddPrescriptionDto {
  @ApiProperty({ required: true })
  @IsArray()
  @IsNotEmpty()
  prescriptionMedications: IPrescriptionMedications[];
}
