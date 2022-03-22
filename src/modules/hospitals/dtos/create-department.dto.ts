import { IsNumber, IsString } from 'class-validator';

export class CreateDepartmentDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  hospitalId: number;
}
