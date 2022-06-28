import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FilesService } from '../../../providers/s3/files.service';
import { Admin } from '../entities/admin.entity';
import { Doctor } from '../entities/doctor.entity';
import { Patient } from '../entities/patient.entity';
import { PatientDiagnose } from '../entities/patientDiagnose.entity';
import { PatientMedication } from '../entities/patientMedication.entity';
import { Relative } from '../entities/relative.entity';
import { DiagnosesService } from './diagnoses.service';
import { MedicationsService } from './medications.service';
import { UsersService } from './users.service';

import * as bcrypt from 'bcrypt';
jest.mock('bcrypt', () => ({
  __esModule: true,
  ...jest.requireActual('bcrypt'),
}));

import { UserRole } from '../entities/user.entity';

let mockedUser = {
  email: 'test1@test.com',
  password: '123test',
  name: 'Cihat',
  surname: 'Yeşildağ',
  address: 'xyz mh. abc sk. No:56 Osmangazi/Bursa',
  phoneNumber: '+905550555050',
  height: 185,
  weight: 80,
  bloodType: 'B+',
  type: UserRole.Doctor,
};

describe('The UsersService', () => {
  let usersService: UsersService;
  let findUser: jest.Mock;
  let bcryptCompare: jest.Mock;
  beforeEach(async () => {
    findUser = jest.fn().mockResolvedValue(mockedUser);
    const mockDoctorRepository = {
      findOne: findUser,
    };

    bcryptCompare = jest.fn().mockReturnValue(true);
    (bcrypt.compare as jest.Mock) = bcryptCompare;

    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: MedicationsService,
          useValue: {},
        },
        {
          provide: FilesService,
          useValue: {},
        },
        {
          provide: DiagnosesService,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Doctor),
          useValue: mockDoctorRepository,
        },
        {
          provide: getRepositoryToken(Patient),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Admin),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PatientDiagnose),
          useValue: {},
        },
        {
          provide: getRepositoryToken(PatientMedication),
          useValue: {},
        },
        {
          provide: getRepositoryToken(Relative),
          useValue: {},
        },
      ],
    }).compile();
    usersService = module.get<UsersService>(UsersService);
  });
  it('can create a new users service instance', async () => {
    expect(usersService).toBeDefined();
  });

  describe('When accessing the data of authenticating user', () => {
    it('should attempt to get a user by email', async () => {
      const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');
      await usersService.signin({
        email: mockedUser.email,
        password: mockedUser.password,
        type: mockedUser.type,
      });
      expect(getByEmailSpy).toBeCalledTimes(1);
    });
    describe('and the provided password is not valid', () => {
      beforeEach(() => {
        bcryptCompare = jest.fn().mockReturnValue(false);
        (bcrypt.compare as jest.Mock) = bcryptCompare;
      });
      it('should throw an error', async () => {
        await expect(
          usersService.signin({
            email: mockedUser.email,
            password: mockedUser.password,
            type: mockedUser.type,
          }),
        ).rejects.toThrow();
      });
    });

    describe('and the provided password is valid', () => {
      describe('and the user is found in the database', () => {
        it('should return the user data', async () => {
          const user = await usersService.signin({
            email: mockedUser.email,
            password: mockedUser.password,
            type: mockedUser.type,
          });

          expect(user).toBeDefined();
          expect(user).toBe(mockedUser);
          expect(user.email).toEqual(mockedUser.email);
          expect(user.password).toEqual(mockedUser.password);
          expect(user.type).toEqual(mockedUser.type);
          expect(user.name).toEqual(mockedUser.name);
        });
      });

      describe('and the user is not found in the database', () => {
        beforeEach(() => {
          findUser.mockResolvedValue(undefined);
        });
        it('should throw an error', async () => {
          await expect(
            usersService.signin({
              email: mockedUser.email,
              password: mockedUser.password,
              type: mockedUser.type,
            }),
          ).rejects.toThrow('Invalid Credentials');
        });
      });
    });
  });
});
