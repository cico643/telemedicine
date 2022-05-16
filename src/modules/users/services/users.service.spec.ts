import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Doctor } from '../entities/doctor.entity';
import { UsersService } from './users.service';

const mockedConfigService = {
  get(key: string) {
    switch (key) {
      case 'COOKIE_SECRET':
        return 'mock_cookie_secret';
    }
  },
};

describe('The UsersService', () => {
  let usersService: UsersService;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
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
    usersService = module.get<UsersService>(UsersService);
  });
  it('can create a new doctors service instance', async () => {
    expect(usersService).toBeDefined();
  });
});
