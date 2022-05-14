import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreatePatientDto {
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
  @IsString()
  @IsNotEmpty()
  @Expose()
  address: string;

  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: '+905555005050',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+[1-9]\d{1,14}$/)
  @Expose()
  phoneNumber: string;

  @ApiProperty({ enum: UserRole, required: true })
  @IsEnum(UserRole)
  @Expose()
  type: UserRole;
}
