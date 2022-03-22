import { IsNumber, IsString } from 'class-validator';

export class CreateHospitalDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  address: string;
}
