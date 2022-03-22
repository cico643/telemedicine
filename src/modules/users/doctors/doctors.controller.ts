import { Body, Controller, Get, HttpCode, Post, Session } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Roles } from '../decorators/roles.decorator';
import { CreateDoctorDto } from '../dtos/create-doctor.dto';
import { SignInUserDto } from '../dtos/sign-in-user.dto';
import { Doctor } from '../entities/doctor.entity';
import { UserRole } from '../entities/user.entity';
import { DoctorsService } from './doctors.service';

@Serialize(CreateDoctorDto)
@Controller('doctors')
export class DoctorsController {
  constructor(private doctorsService: DoctorsService) {}

  @Roles(UserRole.Doctor)
  @Get('/currentUser')
  async getCurrentUser(@CurrentUser() doctor: Doctor) {
    return doctor;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.context = null;
  }

  @Post('/signup')
  async createPatient(@Body() body: CreateDoctorDto, @Session() session: any) {
    const doctor = await this.doctorsService.register(body);
    session.context = {
      userId: doctor.id,
      email: doctor.email,
      type: doctor.type,
    };
    return doctor;
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: SignInUserDto, @Session() session: any) {
    const doctor = await this.doctorsService.signin(body.email, body.password);
    session.context = {
      userId: doctor.id,
      email: doctor.email,
      type: doctor.type,
    };
    return doctor;
  }
}
