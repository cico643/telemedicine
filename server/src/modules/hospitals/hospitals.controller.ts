import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Session,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { CreateHospitalDto } from './dtos/create-hospital.dto';
import { HospitalsService } from './hospitals.service';
import { Session as SessionType } from 'express-session';
import { genericErrorHandler } from '../../lib/genericErrorHandler';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AddDoctorToDepartmentDto } from './dtos/add-doctor-to-department.dto';

@UseGuards(AuthGuard)
@Controller('hospitals')
@ApiTags('hospitals')
export class HospitalsController {
  constructor(
    private hospitalsService: HospitalsService,
    private readonly logger: Logger,
  ) {}

  @Post()
  @Roles(UserRole.Admin)
  @HttpCode(201)
  async addHospital(
    @Body() body: CreateHospitalDto,
    @Session() session: SessionType,
  ) {
    try {
      const hospital = await this.hospitalsService.addHospital(body);
      this.logger.log(
        `Hospital added by admin [userId: ${session.context.id}]`,
        HospitalsController.name,
      );
      return hospital;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get()
  @HttpCode(200)
  async getHospitals() {
    try {
      const hospitals = await this.hospitalsService.getHospitals();
      this.logger.log(`Fetched all hospitals`, HospitalsController.name);
      return hospitals;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('?')
  @HttpCode(200)
  async getHospitalsForGivenCityDistrict(
    @Query('province') province: string,
    @Query('district') district: string,
  ) {
    try {
      const hospitals =
        await this.hospitalsService.getHospitalsForGivenCityDistrict(
          province,
          district,
        );
      this.logger.log(
        `Fetched all hospitals in [${province} - ${district}] `,
        HospitalsController.name,
      );
      return hospitals;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:id')
  @HttpCode(200)
  async getHospital(@Param('id', ParseIntPipe) id: number) {
    return this.hospitalsService.getHospitalById(id);
  }

  @Post('/:id/departments')
  @Roles(UserRole.Admin)
  @HttpCode(201)
  async addDepartment(
    @Body() body: CreateDepartmentDto,
    @Param('id', ParseIntPipe) id: number,
    @Session() session: SessionType,
  ) {
    try {
      const department = await this.hospitalsService.addDepartment(body, id);
      this.logger.log(
        `Department added by admin [userId: ${session.context.id}] for hospital [hospitalId: ${id}]`,
        HospitalsController.name,
      );
      return department;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:id/departments')
  @HttpCode(200)
  async getDepartmentsForGivenHospital(@Param('id', ParseIntPipe) id: number) {
    try {
      const departments =
        await this.hospitalsService.getDepartmentsForGivenHospital(id);
      this.logger.log(
        `Fetched all departments for hospital [hospitalId: ${id}] `,
        HospitalsController.name,
      );
      return departments;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:hospitalId/departments/:departmentId')
  @HttpCode(200)
  async getDepartment(
    @Param('hospitalId', ParseIntPipe) hospitald: number,
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    try {
      const department = await this.hospitalsService.getDepartment(
        departmentId,
      );
      this.logger.log(
        `Fetched department [departmentId: ${departmentId}] for hospital [hospitalId: ${hospitald}] `,
        HospitalsController.name,
      );
      return department;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Post('/:hospitalId/departments/:departmentId/doctors')
  @Roles(UserRole.Admin)
  @HttpCode(201)
  async addDoctorToDepartment(
    @Body() body: AddDoctorToDepartmentDto,
    @Param('hospitalId', ParseIntPipe) hospitald: number,
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    try {
      await this.hospitalsService.addDoctorToDepartment(body, departmentId);
      this.logger.log(
        `Doctor added to the department [departmentId: ${departmentId}] of the hospital [hospitalId: ${hospitald}]`,
        HospitalsController.name,
      );
    } catch (err) {
      return genericErrorHandler(err);
    }
  }

  @Get('/:hospitalId/departments/:departmentId/doctors')
  @HttpCode(200)
  async getDoctorsOfTheGivenDepartment(
    @Param('hospitalId', ParseIntPipe) hospitald: number,
    @Param('departmentId', ParseIntPipe) departmentId: number,
  ) {
    try {
      const doctors =
        await this.hospitalsService.getDoctorsOfTheGivenDepartment(
          departmentId,
        );
      this.logger.log(
        `Fetched all doctors in the department [departmentId: ${departmentId}] for the hospital [hospitalId: ${hospitald}]`,
        HospitalsController.name,
      );
      return doctors;
    } catch (err) {
      return genericErrorHandler(err);
    }
  }
}
