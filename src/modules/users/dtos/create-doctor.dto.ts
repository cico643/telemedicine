import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateDoctorDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  @Expose()
  surname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Expose()
  email: string;

  @ApiProperty({ minLength: 7 })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  departmentId: number;

  @ApiProperty({ enum: UserRole, required: true })
  @IsEnum(UserRole)
  @Expose()
  type: UserRole;
}
