import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doctor } from '../entities/doctor.entity';
import { DoctorsService } from './doctors.service';

const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'COOKIE_SECRET':
        return 'mock_cookie_secret';
    }
  },
};

describe('The DoctorsService', () => {
  let doctorsService: DoctorsService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DoctorsService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: getRepositoryToken(Doctor),
          useValue: {},
        },
      ],
    }).compile();
    doctorsService = module.get<DoctorsService>(DoctorsService);
  });
  it('can create a new doctors service instance', async () => {
    expect(doctorsService).toBeDefined();
  });
});
