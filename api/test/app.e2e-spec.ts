import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@src/app.module';
import { UserService } from '@src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@src/user/entities/user.entity';
import { convertSqlToSqlLite } from '@src/services/tools';
import { CreateLoginDTO } from '@src/auth/dto/login.dto';
import { CreateUserDTO } from '@src/user/dto/create-user.dto';

// interface QueryParams {
//   page?: number;
//   perPage?: number;
//   filter?: string[];
//   q?: string;
//   search?: string[];
//   sort?: string;
//   select?: string;
//   relations?: string;
// }

// function createQueryParams(params: QueryParams): string {
//   const searchParams = new URLSearchParams();

//   // const activeUrl = window.location;

//   Object.entries(params).forEach(([key, value]) => {
//     if (value !== undefined && value !== null) {
//       if (Array.isArray(value)) {
//         if (key === 'filter' && value.length > 0) {
//           value.forEach((item) => {
//             searchParams.append(item.split('=')[0], item.split('=')[1]);
//           });
//         } else {
//           value.forEach((item) => {
//             searchParams.append(key, item);
//           });
//         }
//       } else {
//         searchParams.append(key, value.toString());
//       }
//     }
//   });

//   return `?${searchParams.toString()}`;
// }

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let token: string | null = null;

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') convertSqlToSqlLite();
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TypeOrmModule.forFeature([User])],
      providers: [UserService],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });

  describe('Authentification', () => {
    const loginDto: CreateLoginDTO = {
      email: 'theo.fargeas@what-ai.io',
      password: 'Theo1234*',
    };
    const registerDto: CreateUserDTO = {
      email: 'theo.fargeas@what-ai.io',
      password: 'Theo1234*',
      firstName: 'Théo',
      lastName: 'Fargeas',
    };

    describe('Register', () => {
      it('register a native user', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(HttpStatus.OK);
        // .expect(HttpStatus.CREATED);
        expect(response.body).toHaveProperty('bearer');
        token = response.body.bearer;
      });

      it('register same user', async () => {
        await request(app.getHttpServer())
          .post('/auth/register')
          .send(registerDto)
          .expect(HttpStatus.BAD_REQUEST);
      });
    });

    describe('Validation', () => {
      it('login a no active user invalide', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(HttpStatus.PAYMENT_REQUIRED);
      });

      it('System - Activated account', async () => {
        const response = await request(app.getHttpServer()).get(
          `/auth/confirm?token=${token}`,
        );
        expect(response.body).toHaveProperty('bearer');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data).toHaveProperty('email');
        token = response.body.bearer;
      });
    });

    describe('Login', () => {
      it('login a user without register', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ ...loginDto, email: 'fake@example.com' })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('login a invalid native user', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ ...loginDto, email: 'fake@example.com' })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('login a invalid password native user', async () => {
        await request(app.getHttpServer())
          .post('/auth/login')
          .send({ ...loginDto, password: 'fake@example.com' })
          .expect(HttpStatus.BAD_REQUEST);
      });

      it('login a native user', async () => {
        const response = await request(app.getHttpServer())
          .post('/auth/login')
          .send(loginDto)
          .expect(HttpStatus.OK);
        expect(response.body).toHaveProperty('bearer');
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('id');
        expect(response.body.user).toHaveProperty('email');
        token = response.body.bearer;
      });
    });

    describe('Basic request after auth success', () => {
      it('Get User details', async () => {
        const { body }: { body: User } = await request(app.getHttpServer())
          .get('/auth/me')
          .set('authorization', 'Bearer ' + token)
          .set('Content-Type', 'application/json')
          .send()
          .expect(HttpStatus.OK);
        expect(body.email).toBe(registerDto.email);
        expect(body.firstName).toBe(registerDto.firstName);
        expect(body.lastName).toBe(registerDto.lastName);
      });
    });

    describe('Request invalid', () => {
      it('Invalid endpoint', () => {
        request(app.getHttpServer())
          .get('/ezdzed/me')
          .set('authorization', 'Bearer ' + token)
          .set('Content-Type', 'application/json')
          .send()
          .expect(HttpStatus.NOT_FOUND);
      });
      it('Invalid jwt', () => {
        request(app.getHttpServer())
          .get('/auth/me')
          .set('authorization', 'Bearer ' + 'token')
          .set('Content-Type', 'application/json')
          .send()
          .expect(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
