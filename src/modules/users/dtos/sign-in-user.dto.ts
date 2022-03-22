import { IsEmail, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class SignInUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  type: UserRole;
}
