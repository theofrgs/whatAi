import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { UserModule } from '@src/user/user.module';
import { User } from '@src/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@src/user/user.service';
import { convertSqlToSqlLite } from '@src/services/tools';
import { CreateUserDTO } from '@src/user/dto/create-user.dto';
import { CreateLoginDTO } from './dto/login.dto';
import { HashService } from '@src/services/hash/hash.service';

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') convertSqlToSqlLite();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          imports: [ConfigModule],
          useFactory: (configService: ConfigService) => ({
            secret: configService.get('API_JWT_SECRET'),
            signOptions: { expiresIn: '6000h' },
          }),
          inject: [ConfigService],
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: ['../**/*.entity.ts'],
          synchronize: true,
          logging: false,
        }),
        UserModule,
      ],
      providers: [AuthService, HashService],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    const connection = userRepository.manager.connection;
    await connection.dropDatabase();
  });

  describe('registerNative', () => {
    const dto: CreateUserDTO = {
      email: 'test@example.com',
      firstName: 'joe',
      lastName: 'devoe',
      password: 'password',
    };

    it('Basic', async () => {
      const rslt = await service.registerNative(dto);
      const user = await userService.findOneByOrFail({ email: dto.email });
      expect(rslt).toHaveProperty('access_token');
      expect(user.email).toBe(dto.email);
      expect(user.lastName).toBe(dto.lastName);
      expect(user.firstName).toBe(dto.firstName);
    });

    it('Error - Same email', async () => {
      await expect(service.registerNative(dto)).rejects.toThrow(
        `User with this email already exist`,
      );
    });
  });

  describe('login', () => {
    const dto: CreateLoginDTO = {
      email: 'test@example.com',
      password: 'password',
    };

    it('Basic', async () => {
      const rslt = await service.loginNative(dto);
      expect(rslt).toHaveProperty('access_token');
    });

    it('Error - Invalid email', async () => {
      await expect(
        service.loginNative({ ...dto, email: 'theo@gmail.com' }),
      ).rejects.toThrow(`Not found`);
    });

    it('Error - Invalid password', async () => {
      await expect(
        service.loginNative({ ...dto, password: 'theo@gmail.com' }),
      ).rejects.toThrow(`Invalid credentials`);
    });
  });
});
