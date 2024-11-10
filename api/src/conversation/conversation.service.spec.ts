import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConversationService } from './conversation.service';
import { Conversation } from './entities/conversation.entity';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { CreateConversationDTO } from './dto/create-conversation.dto';
import { convertSqlToSqlLite } from '@src/services/tools';
import { UserService } from '@src/user/user.service';
import { User } from '@src/user/entities/user.entity';
import { HashService } from '@src/services/hash/hash.service';

describe('ConversationService(more tester for base service)', () => {
  let service: ConversationService;
  let conversationRepository: Repository<Conversation>;
  let userService: UserService;
  let user: User;

  beforeAll(async () => {
    if (process.env.NODE_ENV === 'test') convertSqlToSqlLite();
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
        TypeOrmModule.forFeature([Conversation, User]),
      ],
      providers: [ConversationService, UserService, HashService],
    }).compile();

    service = module.get<ConversationService>(ConversationService);
    conversationRepository = module.get<Repository<Conversation>>(
      getRepositoryToken(Conversation),
    );
    userService = module.get<UserService>(UserService);

    user = await userService.create({
      email: 'test@example.com',
      firstName: 'joe',
      lastName: 'devoe',
      password: 'password',
    });
  });

  afterAll(async () => {
    const connection = conversationRepository.manager.connection;
    await connection.dropDatabase();
  });

  describe('Create', () => {
    const dto: CreateConversationDTO = {
      title: 'conv title',
    } as CreateConversationDTO;

    it('Basic', async () => {
      const conversation: Conversation = await service.create({
        ...dto,
        creator: user,
      });
      expect(conversation.title).toBe(dto.title);
    });

    it('Error - Same title', async () => {
      await expect(
        service.create({
          ...dto,
          creator: user,
        }),
      ).rejects.toThrow('Conversation with this title already exist');
    });
  });

  describe('Get all', () => {
    it('Basic', async () => {
      const founded: Conversation[] = await service.findBy({});
      expect(founded.length).toBe(1);
    });

    describe('Pagination', () => {
      it('Create 10 fake conversations', async () => {
        for (let i = 0; i < 10; i++) {
          const dto: CreateConversationDTO = {
            title: `title${i}`,
            creator: user,
          };
          await service.create(dto);
        }
      });
      it('Per page', async () => {
        let founded: Conversation[] = await service.findBy({}, [], {}, null, {
          page: 0,
          perPage: 5,
        });
        expect(founded.length).toBe(5);
        for (let i = 1; i < 5; i++) {
          expect(founded[i].title).toBe(`title${i - 1}`);
        }
        founded = await service.findBy({}, [], {}, null, {
          page: 1,
          perPage: 5,
        });
        expect(founded.length).toBe(5);
        for (let i = 1; i < 5; i++) {
          expect(founded[i].title).toBe(`title${i + 4}`);
        }
      });
      it('Page', async () => {
        const founded: Conversation[] = await service.findBy({}, [], {}, null, {
          page: 10,
          perPage: 5,
        });
        expect(founded.length).toBe(0);
      });
    });

    // describe('Filter', () => {
    //   it('Create fake data', async () => {
    //     for (let i = 0; i < 10; i++) {
    //       const dto: CreateConversationDTO = {
    //         title: `conv${i}`,
    //       };
    //       await service.create(dto);
    //     }
    //   });
    //   it('By one filter', async () => {
    //     const founded: Conversation[] = await service.findBy({}, [], {}, null, {
    //       searchBy: { title: 'conv' },
    //     });
    //     expect(founded.length).toBe(10);
    //     for (let i = 1; i < 10; i++) {
    //       expect(founded[i].lastName).toBe(`miquelon`);
    //     }
    //   });
    //   it('By severals filters', async () => {
    //     const founded: Conversation[] = await service.findBy({}, [], {}, null, {
    //       searchBy: { lastName: 'miquelon', firstName: 'pierre' },
    //     });
    //     expect(founded.length).toBe(10);
    //     for (let i = 1; i < 10; i++) {
    //       expect(founded[i].firstName).toBe(`pierre`);
    //       expect(founded[i].lastName).toBe(`miquelon`);
    //     }
    //   });
    //   it('Get invalid filters', async () => {
    //     expect(
    //       service.findBy({}, [], {}, null, {
    //         searchBy: { jean: 'miquelon', firstName: 'pierre' },
    //       }),
    //     ).rejects.toThrow('Invalid query params');
    //   });
    // });

    describe('Select', () => {
      it('Get one field', async () => {
        const founded: any[] = (await service.findBy({}, [], {}, null, {
          select: ['title'],
        })) as any;
        for (let i = 1; i < 10; i++) {
          expect(Object.keys(founded[i])).toEqual(['title']);
        }
      });
      it('Get invalid fields', async () => {
        expect(
          service.findBy({}, [], {}, null, {
            select: ['jean', 'firstName'],
          }),
        ).rejects.toThrow('Invalid query params');
      });
    });

    // TODO add error case

    // TODO need to find a way
    // describe('Sort', () => {
    //   it('By asc creation date', async () => {
    //     const founded: Conversation[] = await service.findBy({}, [], {}, null, {
    //       sortBy: { createdAt: 'ASC' },
    //     });
    //     console.log(founded);
    //   });
    // });
  });

  describe('Get one', () => {
    it('By title', async () => {
      expect(
        (
          await service.findOneBy({
            title: 'conv title',
          })
        ).title,
      ).toBe('conv title');
    });

    it('Wrong title', async () => {
      expect(
        await service.findOneBy({
          title: 'devoe',
        }),
      ).toBe(null);
    });
  });

  describe('Get one or fail', () => {
    it('By title', async () => {
      expect(
        (
          await service.findOneByOrFail({
            title: 'conv title',
          })
        ).title,
      ).toBe('conv title');
      await expect(
        service.findOneByOrFail({
          title: 'test@a.com',
        }),
      ).rejects.toThrow('Not found');
    });
  });

  describe('Update', () => {
    let conversation: Conversation;

    it('Get conversation', async () => {
      conversation = await service.findOneByOrFail({
        title: 'conv title',
      });
    });

    it('Basic - Update title', async () => {
      const updated: Conversation = await service.update(conversation.id, {
        title: 'New title',
      });
      expect(updated.title).toBe('New title');
    });

    it('Error - Wrong id', async () => {
      await expect(service.update('fakeId', {})).rejects.toThrow('Not found');
    });
  });

  describe('Delete', () => {
    let conversation: Conversation;

    it('Get conversation', async () => {
      conversation = await service.findOneByOrFail({
        title: 'New title',
      });
    });

    it('Basic', async () => {
      const deleteResult: any = await service.remove(conversation.id);

      expect(deleteResult).toBe(`${conversation.id} has been removed`);
      const deletedConversation: Conversation | null = await service.findOneBy({
        title: 'New title',
      });
      expect(deletedConversation).toBe(null);
    });

    it('Error - Wrong id', async () => {
      await expect(service.remove('fakeId')).rejects.toThrow('Not found');
    });
  });
});
