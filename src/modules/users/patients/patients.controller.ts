import { Body, Controller, Get, HttpCode, Post, Session } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Serialize } from 'src/common/interceptors/serialize.interceptor';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import { Roles } from '../../../common/decorators/roles.decorator';
import { CreatePatientDto } from '../dtos/create-patient.dto';
import { SignInUserDto } from '../dtos/sign-in-user.dto';
import { Patient } from '../entities/patient.entity';
import { UserRole } from '../entities/user.entity';
import { PatientsService } from './patients.service';

@Serialize(CreatePatientDto)
@ApiTags('patients')
@Controller('patients')
export class PatientsController {
  constructor(private patientsService: PatientsService) {}

  @Get('/currentUser')
  @Roles(UserRole.Patient)
  async getCurrentUser(@CurrentUser() patient: Patient) {
    return patient;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.context = null;
    session.destroy(null);
  }

  @Post('/signup')
  async createPatient(@Body() body: CreatePatientDto, @Session() session: any) {
    const patient = await this.patientsService.register(body);
    session.context = {
      userId: patient.id,
      email: patient.email,
      type: patient.type,
    };
    return patient;
  }

  @Post('/signin')
  @HttpCode(200)
  async signin(@Body() body: SignInUserDto, @Session() session: any) {
    const patient = await this.patientsService.signin(
      body.email,
      body.password,
    );
    session.context = {
      userId: patient.id,
      email: patient.email,
      type: patient.type,
    };
    return patient;
  }
}
