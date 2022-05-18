import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { BloodTypes } from '../entities/patient.entity';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  surname: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ minLength: 7 })
  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  password: string;

  @ApiProperty({ required: true })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: '+905555005050',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  phoneNumber: string;

  @ApiProperty({ enum: UserRole, required: true })
  @IsEnum(UserRole)
  type: UserRole;

  @ApiProperty({ enum: BloodTypes, required: true })
  @IsEnum(BloodTypes)
  bloodType: BloodTypes;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  height: number;

  @ApiProperty({ required: true })
  @IsNumber()
  @IsNotEmpty()
  weight: number;
}
