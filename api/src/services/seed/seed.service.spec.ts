import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { User } from '@src/user/entities/user.entity';
import { UserModule } from '@src/user/user.module';
import { UserService } from '@src/user/user.service';
import { Repository } from 'typeorm';
import { convertSqlToSqlLite } from '../tools';
import { ConfigModule } from '@nestjs/config';
import { HashService } from '../hash/hash.service';

describe('SeedService(more tester for base service)', () => {
  let service: SeedService;
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') convertSqlToSqlLite();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          cache: true,
        }),
        UserModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: ['../**/*.entity.ts'],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [SeedService, UserService, HashService],
    }).compile();

    service = module.get<SeedService>(SeedService);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    await service.seedAll();
  });

  afterAll(async () => {
    const connection = userRepository.manager.connection;
    await connection.dropDatabase();
  });

  describe('Check user', () => {
    it('Admin', async () => {
      const users = await userService.findBy();
      expect(users[0].email).toBe(process.env.ADMIN_NAME);
      expect(users[0].firstName).toBe('administrator');
      expect(users[0].lastName).toBe('administrator');
    });

    it('Test fake user', async () => {
      const users = await userService.findBy();

      expect(users.length).toBe(31);
      for (let i = 1; i < 30; i++) {
        expect(users[i].email).toBe(`what-ai-test-mail${i - 1}@example.com`);
        expect(users[i].firstName).toBe(`what-ai-test-firstname${i - 1}`);
        expect(users[i].lastName).toBe(`what-ai-test-lastname${i - 1}`);
      }
    });
  });
});
