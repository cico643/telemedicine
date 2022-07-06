import { INestApplication } from '@nestjs/common';
import { CreateUserDto } from '../src/modules/users/dtos/create-user.dto';
import { BloodTypes } from '../src/modules/users/entities/patient.entity';
import { UserRole } from '../src/modules/users/entities/user.entity';
import request from 'supertest';

global.createTestUser = async (
  app: INestApplication,
): Promise<CreateUserDto> => {
  const createUserDto: CreateUserDto = {
    email: 'test1@test.com',
    password: '123test',
    name: 'Cihat',
    surname: 'Yeşildağ',
    address: 'xyz mh. abc sk. No:56 Osmangazi/Bursa',
    phoneNumber: '+905550555050',
    height: 185,
    weight: 80,
    bloodType: BloodTypes.BPositive,
    type: UserRole.Doctor,
  };

  await request(app.getHttpServer()).post('/auth/signup').send(createUserDto);

  return createUserDto;
};
