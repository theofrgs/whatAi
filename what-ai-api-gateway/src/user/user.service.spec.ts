import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { CreateUserDTO } from './dto/create-user.dto';

describe('UserService(more tester for base service)', () => {
  let service: UserService;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: ['../**/*.entity.ts'],
          synchronize: true,
          logging: false,
        }),
        TypeOrmModule.forFeature([User]),
      ],
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterAll(async () => {
    const connection = userRepository.manager.connection;
    await connection.dropDatabase();
  });

  describe('Create', () => {
    const dto: CreateUserDTO = {
      email: 'test@example.com',
      password: 'Theo1234*',
      first_name: 'joe',
      last_name: 'devoe',
    };

    it('Basic', async () => {
      const user: User = await service.create(dto);
      expect(user.email).toBe(dto.email);
      expect(user.first_name).toBe(dto.first_name);
      expect(user.last_name).toBe(dto.last_name);
    });

    it('Error - Same email', async () => {
      await expect(service.create(dto)).rejects.toThrow(
        'User with this email already exist',
      );
    });
  });

  describe('Get all', () => {
    it('Basic', async () => {
      const founded: User[] = await service.findBy({});
      expect(founded.length).toBe(1);
    });

    describe('Pagination', () => {
      it('Create 10 fake users', async () => {
        for (let i = 0; i < 10; i++) {
          const dto: CreateUserDTO = {
            email: `joe${i}@example.com`,
            password: 'Theo1234*',
            first_name: `joe${i}`,
            last_name: `devoe${i}`,
          };
          await service.create(dto);
        }
      });
      it('Per page', async () => {
        let founded: User[] = await service.findBy({}, [], {}, null, {
          page: 0,
          perPage: 5,
        });
        expect(founded.length).toBe(5);
        for (let i = 1; i < 5; i++) {
          expect(founded[i].email).toBe(`joe${i - 1}@example.com`);
          expect(founded[i].first_name).toBe(`joe${i - 1}`);
          expect(founded[i].last_name).toBe(`devoe${i - 1}`);
        }
        founded = await service.findBy({}, [], {}, null, {
          page: 1,
          perPage: 5,
        });
        expect(founded.length).toBe(5);
        for (let i = 1; i < 5; i++) {
          expect(founded[i].email).toBe(`joe${i + 4}@example.com`);
          expect(founded[i].first_name).toBe(`joe${i + 4}`);
          expect(founded[i].last_name).toBe(`devoe${i + 4}`);
        }
      });
      it('Page', async () => {
        const founded: User[] = await service.findBy({}, [], {}, null, {
          page: 10,
          perPage: 5,
        });
        expect(founded.length).toBe(0);
      });
    });

    describe('Filter', () => {
      it('Create fake data', async () => {
        for (let i = 0; i < 10; i++) {
          const dto: CreateUserDTO = {
            password: 'Theo1234*',
            email: `pierre${i}@gmail.com`,
            first_name: `pierre`,
            last_name: `miquelon`,
          };
          await service.create(dto);
        }
      });
      it('By one filter', async () => {
        const founded: User[] = await service.findBy({}, [], {}, null, {
          searchBy: { last_name: 'miquelon' },
        });
        expect(founded.length).toBe(10);
        for (let i = 1; i < 10; i++) {
          expect(founded[i].last_name).toBe(`miquelon`);
        }
      });
      it('By severals filters', async () => {
        const founded: User[] = await service.findBy({}, [], {}, null, {
          searchBy: { last_name: 'miquelon', first_name: 'pierre' },
        });
        expect(founded.length).toBe(10);
        for (let i = 1; i < 10; i++) {
          expect(founded[i].first_name).toBe(`pierre`);
          expect(founded[i].last_name).toBe(`miquelon`);
        }
      });
      it('Get invalid filters', async () => {
        expect(
          service.findBy({}, [], {}, null, {
            searchBy: { jean: 'miquelon', first_name: 'pierre' },
          }),
        ).rejects.toThrow('Invalid query params');
      });
    });

    describe('Select', () => {
      it('Get one field', async () => {
        const founded: any[] = (await service.findBy({}, [], {}, null, {
          select: ['email'],
        })) as any;
        for (let i = 1; i < 10; i++) {
          expect(Object.keys(founded[i])).toEqual(['email']);
        }
      });
      it('Get severals fields', async () => {
        const founded: any[] = (await service.findBy({}, [], {}, null, {
          select: ['email', 'first_name'],
        })) as any;
        for (let i = 1; i < 10; i++) {
          expect(Object.keys(founded[i])).toEqual(['email', 'first_name']);
        }
      });
      it('Get invalid fields', async () => {
        expect(
          service.findBy({}, [], {}, null, {
            select: ['jean', 'first_name'],
          }),
        ).rejects.toThrow('Invalid query params');
      });
    });

    // TODO add error case

    // TODO need to find a way
    // describe('Sort', () => {
    //   it('By asc creation date', async () => {
    //     const founded: User[] = await service.findBy({}, [], {}, null, {
    //       sortBy: { createdAt: 'ASC' },
    //     });
    //     console.log(founded);
    //   });
    // });
  });

  describe('Get one', () => {
    it('By email', async () => {
      expect(
        (
          await service.findOneBy({
            email: 'test@example.com',
          })
        ).email,
      ).toBe('test@example.com');
    });

    it('By first_name', async () => {
      expect(
        (
          await service.findOneBy({
            first_name: 'joe',
          })
        ).email,
      ).toBe('test@example.com');
    });

    it('By last_name', async () => {
      expect(
        (
          await service.findOneBy({
            last_name: 'devoe',
          })
        ).email,
      ).toBe('test@example.com');
    });

    it('Wrong first name', async () => {
      expect(
        await service.findOneBy({
          first_name: 'devoe',
        }),
      ).toBe(null);
    });
  });

  describe('Get one or fail', () => {
    it('By email', async () => {
      expect(
        (
          await service.findOneByOrFail({
            email: 'test@example.com',
          })
        ).email,
      ).toBe('test@example.com');
      await expect(
        service.findOneByOrFail({
          email: 'test@a.com',
        }),
      ).rejects.toThrow('Not found');
    });

    it('By first_name', async () => {
      expect(
        (
          await service.findOneByOrFail({
            first_name: 'joe',
          })
        ).email,
      ).toBe('test@example.com');
      await expect(
        service.findOneByOrFail({
          first_name: 'dze',
        }),
      ).rejects.toThrow('Not found');
    });

    it('By last_name', async () => {
      expect(
        (
          await service.findOneByOrFail({
            last_name: 'devoe',
          })
        ).email,
      ).toBe('test@example.com');
      await expect(
        service.findOneByOrFail({
          last_name: 'devoedeze',
        }),
      ).rejects.toThrow('Not found');
    });
  });

  describe('Update', () => {
    let user: User;

    it('Get user', async () => {
      user = await service.findOneByOrFail({ email: 'test@example.com' });
    });

    it('Basic - Update first name', async () => {
      const updated: User = await service.update(user.id, {
        first_name: 'New first name',
      });
      expect(updated.first_name).toBe('New first name');
    });

    it('Basic - Update last name', async () => {
      const updated: User = await service.update(user.id, {
        last_name: 'New last name',
      });
      expect(updated.last_name).toBe('New last name');
    });

    it('Error - Wrong id', async () => {
      await expect(service.update('fakeId', {})).rejects.toThrow('Not found');
    });
  });

  describe('Delete', () => {
    let user: User;

    it('Get user', async () => {
      user = await service.findOneByOrFail({ email: 'test@example.com' });
    });

    it('Basic', async () => {
      const deleteResult: any = await service.remove(user.id);

      expect(deleteResult).toBe(`${user.id} has been removed`);
      const deletedUser: User | null = await service.findOneBy({
        email: 'test@example.com',
      });
      expect(deletedUser).toBe(null);
    });

    it('Error - Wrong id', async () => {
      await expect(service.remove('fakeId')).rejects.toThrow('Not found');
    });
  });
});
