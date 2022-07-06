import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { Redis } from 'ioredis';
import { RedisService } from '../src/providers/redis/redis.service';
import { session } from '../src/common/middlewares/session.middleware';
import cookieParser from 'cookie-parser';
import { SESSION_SECRET } from '../src/config';
import { CreateUserDto } from '../src/modules/users/dtos/create-user.dto';
import { BloodTypes } from '../src/modules/users/entities/patient.entity';
import { UserRole } from '../src/modules/users/entities/user.entity';
import { Connection } from 'typeorm';
import { getConnectionToken } from '@nestjs/typeorm';
import { AppModule } from '../src/app.module';
import { RolesGuard } from '../src/common/guards/role.guard';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let redis: Redis;
  let connection: Connection;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: APP_PIPE,
          useValue: new ValidationPipe({
            whitelist: true,
          }),
        },
        {
          provide: APP_GUARD,
          useClass: RolesGuard,
        },
      ],
    }).compile();

    app = module.createNestApplication();
    redis = module.get<RedisService>(RedisService).instance;
    connection = module.get(getConnectionToken());

    app.use(session(redis));
    app.use(cookieParser(SESSION_SECRET));

    await app.init();
  });

  beforeEach(async () => {
    await connection.synchronize(true);
  });

  afterEach(async () => {
    await connection.dropDatabase();
  });

  afterAll(async () => {
    await connection.close();
    redis.disconnect();
    await app.close();
  });

  describe('Signup', () => {
    const mockedUser: CreateUserDto = {
      email: 'test3@test.com',
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

    it('should create a doctor user', async () => {
      await request(app.getHttpServer())
        .post('/auth/signup')
        .send(mockedUser)
        .expect(HttpStatus.CREATED)
        .expect((res) => {
          const { body } = res;
          expect(body.id).toBeDefined();
          expect(body.email).toEqual(mockedUser.email);
          expect(body.name).toEqual(mockedUser.name);
          expect(body.type).toEqual(mockedUser.type);
          expect(body.password).toBeUndefined();
        });
    });
  });

  describe('Signin', () => {
    it('should signin a doctor user', async () => {
      const user = await createTestUser(app);
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: user.password, type: user.type })
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { body, headers } = res;
          const cookies = headers['set-cookie'] as string[];
          const sessionCookie = cookies.find((val) =>
            val.startsWith('session_token='),
          );

          expect(body.id).toBeDefined();
          expect(body.email).toEqual(user.email);
          expect(cookies).toBeDefined();
          expect(sessionCookie).toBeDefined();
          console.log(sessionCookie);
        });
    });

    it('should return bad request for invalid email', async () => {
      const user = await createTestUser(app);
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({
          email: user.email + 'gibberish',
          password: user.password,
          type: user.type,
        })
        .expect(HttpStatus.BAD_REQUEST);
    });
  });

  describe('Signout', () => {
    it('should signout a doctor user', async () => {
      const user = await createTestUser(app);
      await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ email: user.email, password: user.password, type: user.type });
      await request(app.getHttpServer())
        .post('/auth/signout')
        .expect(HttpStatus.OK)
        .expect((res) => {
          const { body, headers } = res;
          const cookies = headers['set-cookie'] as string[];
          const sessionCookie = cookies.find((val) =>
            val.startsWith('session_token='),
          );
          const token = sessionCookie.split('session_token=');

          expect(token[1].startsWith(';')).toBeTruthy();
        });
    });
  });
});
