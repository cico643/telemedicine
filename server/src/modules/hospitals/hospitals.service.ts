import { forwardRef, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from '../users/entities/doctor.entity';
import { UsersService } from '../users/services/users.service';
import { AddDoctorToDepartmentDto } from './dtos/add-doctor-to-department.dto';
import { CreateDepartmentDto } from './dtos/create-department.dto';
import { CreateHospitalDto } from './dtos/create-hospital.dto';
import { Department } from './entities/department.entity';
import { Hospital } from './entities/hospital.entity';
import HospitalsSearchService from './hospitals-search.service';

export class HospitalsService {
  constructor(
    @InjectRepository(Hospital)
    private hospitalsRepository: Repository<Hospital>,
    @InjectRepository(Department)
    private departmentsRepository: Repository<Department>,
    private usersService: UsersService,
    @InjectRepository(Doctor)
    private doctorsRepository: Repository<Doctor>,
    private hospitalsSearchService: HospitalsSearchService,
  ) {}

  async addHospital(hospitalDto: CreateHospitalDto) {
    try {
      const hospital = await this.hospitalsRepository.create(hospitalDto);
      await this.hospitalsRepository.save(hospital);
      await this.hospitalsSearchService.indexHospital(hospital);
      return hospital;
    } catch (err) {
      throw new HttpException(
        'Something went wrong',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  getHospitals() {
    return this.hospitalsRepository.find();
  }

  async getHospitalsForGivenCityDistrict(province: string, district: string) {
    const hospitals =
      await this.hospitalsSearchService.searchHospitalsForGivenCityDistrict(
        province,
        district,
      );
    const hospitalss = await this.hospitalsRepository.find({
      where: {
        province,
        district,
      },
    });
    return hospitals;
  }

  getHospitalById(id: number) {
    return this.hospitalsRepository.findOne(id);
  }

  async addDepartment(body: CreateDepartmentDto, id: number) {
    const hospital = await this.getHospitalById(id);
    const department = await this.departmentsRepository.create({
      name: body.name,
      hospital,
    });
    await this.departmentsRepository.save(department);
    return department;
  }

  async getDepartmentsForGivenHospital(id: number) {
    const hospital = await this.getHospitalById(id);
    const departments = await this.departmentsRepository.find({
      where: { hospital: id },
    });
    return departments;
  }

  async getDepartment(id: number) {
    const department = await this.departmentsRepository.findOne(id);
    return department;
  }

  async addDoctorToDepartment(
    body: AddDoctorToDepartmentDto,
    departmentId: number,
  ) {
    const department = await this.departmentsRepository.findOne(departmentId);
    const doctor = (await this.usersService.findById(
      body.doctorId,
      this.usersService.findTargetRepository('doctor'),
    )) as Doctor;
    doctor.department = department;
    await this.doctorsRepository.save(doctor);
  }

  async getDoctorsOfTheGivenDepartment(departmentId: number) {
    const department = await this.departmentsRepository.findOne(departmentId, {
      relations: ['doctors'],
    });
    return department.doctors;
  }
}
