import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddDocumentDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;
}
