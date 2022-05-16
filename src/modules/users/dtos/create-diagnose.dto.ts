import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiagnoseDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
