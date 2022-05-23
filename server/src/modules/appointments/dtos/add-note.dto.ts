import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class AddNoteDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  note: string;
}
