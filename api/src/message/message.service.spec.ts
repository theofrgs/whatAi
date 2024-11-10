import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MessageService } from './message.service';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { CreateMessageDTO } from './dto/create-message.dto';
import { convertSqlToSqlLite } from '@src/services/tools';
import { HashService } from '@src/services/hash/hash.service';
import { ConversationService } from '@src/conversation/conversation.service';
import { Conversation } from '@src/conversation/entities/conversation.entity';
import { User } from '@src/user/entities/user.entity';
import { UserService } from '@src/user/user.service';

describe('MessageService(more tester for base service)', () => {
  let service: MessageService;
  let conversationService: ConversationService;
  let userService: UserService;
  let conversation: Conversation;
  let user: User;
  let messageRepository: Repository<Message>;

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
        TypeOrmModule.forFeature([Message, Conversation, User]),
      ],
      providers: [
        MessageService,
        HashService,
        ConversationService,
        UserService,
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    conversationService = module.get<ConversationService>(ConversationService);
    userService = module.get<UserService>(UserService);
    messageRepository = module.get<Repository<Message>>(
      getRepositoryToken(Message),
    );

    user = await userService.create({
      email: 'test@example.com',
      firstName: 'joe',
      lastName: 'devoe',
      password: 'password',
    });

    conversation = await conversationService.create({
      title: 'conv title',
      creator: user,
    });
  });

  afterAll(async () => {
    const connection = messageRepository.manager.connection;
    await connection.dropDatabase();
  });

  describe('Create', () => {
    it('Basic', async () => {
      const dto: CreateMessageDTO = {
        content: 'Hello world',
        conversation,
        author: user,
      };
      const message: Message = await service.create(dto);
      expect(message.content).toBe(dto.content);
    });
  });

  describe('Get all', () => {
    it('Basic', async () => {
      const founded: Message[] = await service.findBy({});
      expect(founded.length).toBe(1);
    });

    describe('Pagination', () => {
      it('Create 10 fake messages', async () => {
        for (let i = 0; i < 10; i++) {
          const dto: CreateMessageDTO = {
            content: `Hello world ${i}`,
            conversation,
            author: user,
          };
          await service.create(dto);
        }
      });
      it('Per page', async () => {
        let founded: Message[] = await service.findBy({}, [], {}, null, {
          page: 0,
          perPage: 5,
        });
        expect(founded.length).toBe(5);
        for (let i = 1; i < 5; i++) {
          expect(founded[i].content).toBe(`Hello world ${i - 1}`);
        }
        founded = await service.findBy({}, [], {}, null, {
          page: 1,
          perPage: 5,
        });
        expect(founded.length).toBe(5);
        for (let i = 1; i < 5; i++) {
          expect(founded[i].content).toBe(`Hello world ${i + 4}`);
        }
      });
      it('Page', async () => {
        const founded: Message[] = await service.findBy({}, [], {}, null, {
          page: 10,
          perPage: 5,
        });
        expect(founded.length).toBe(0);
      });
    });

    // describe('Filter', () => {
    //   it('Create fake data', async () => {
    //     for (let i = 0; i < 10; i++) {
    //       const dto: CreateMessageDTO = {
    //         content: `Hello ${i}`,
    //         conversation,
    //         author: user,
    //       };
    //       await service.create(dto);
    //     }
    //   });
    //   it('By one filter', async () => {
    //     const founded: Message[] = await service.findBy({}, [], {}, null, {
    //       searchBy: { lastName: 'miquelon' },
    //     });
    //     expect(founded.length).toBe(10);
    //     for (let i = 1; i < 10; i++) {
    //       expect(founded[i].lastName).toBe(`miquelon`);
    //     }
    //   });
    //   it('By severals filters', async () => {
    //     const founded: Message[] = await service.findBy({}, [], {}, null, {
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
          select: ['content'],
        })) as any;
        for (let i = 1; i < 10; i++) {
          expect(Object.keys(founded[i])).toEqual(['content']);
        }
      });
      // it('Get severals fields', async () => {
      //   const founded: any[] = (await service.findBy({}, [], {}, null, {
      //     select: ['content', 'author'],
      //   })) as any;
      //   for (let i = 1; i < 10; i++) {
      //     expect(Object.keys(founded[i])).toEqual(['content', 'author']);
      //   }
      // });
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
    //     const founded: Message[] = await service.findBy({}, [], {}, null, {
    //       sortBy: { createdAt: 'ASC' },
    //     });
    //     console.log(founded);
    //   });
    // });
  });

  describe('Get one', () => {
    it('By content', async () => {
      expect(
        (
          await service.findOneBy({
            content: 'Hello world',
          })
        ).content,
      ).toBe('Hello world');
    });

    it('By user firstName', async () => {
      expect(
        (
          await service.findOneBy(
            {
              author: { firstName: 'joe' },
            },
            ['author'],
          )
        ).author.firstName,
      ).toBe('joe');
    });

    it('By conversation title', async () => {
      expect(
        (
          await service.findOneBy(
            {
              conversation: { title: 'conv title' },
            },
            ['conversation'],
          )
        ).conversation.title,
      ).toBe('conv title');
    });

    it('Wrong first name', async () => {
      expect(
        await service.findOneBy({
          content: 'devoe',
        }),
      ).toBe(null);
    });
  });

  describe('Get one or fail', () => {
    it('By content', async () => {
      expect(
        (
          await service.findOneByOrFail({
            content: 'Hello world',
          })
        ).content,
      ).toBe('Hello world');
      await expect(
        service.findOneByOrFail({
          content: 'Hello worldezdzedd',
        }),
      ).rejects.toThrow('Not found');
    });

    it('By user firstname', async () => {
      expect(
        (
          await service.findOneBy(
            {
              author: { firstName: 'joe' },
            },
            ['author'],
          )
        ).author.firstName,
      ).toBe('joe');
      await expect(
        service.findOneByOrFail({
          author: { firstName: 'jodezdeze' },
        }),
      ).rejects.toThrow('Not found');
    });

    it('By conv titlte', async () => {
      expect(
        (
          await service.findOneBy(
            {
              conversation: { title: 'conv title' },
            },
            ['conversation'],
          )
        ).conversation.title,
      ).toBe('conv title');
      await expect(
        service.findOneByOrFail({
          conversation: { title: 'condzdezv title' },
        }),
      ).rejects.toThrow('Not found');
    });
  });

  describe('Update', () => {
    let message: Message;

    it('Get message', async () => {
      message = await service.findOneByOrFail({ content: 'Hello world' });
    });

    it('Basic - Update content', async () => {
      const updated: Message = await service.update(message.id, {
        content: 'patrick',
      });
      expect(updated.content).toBe('patrick');
    });

    it('Error - Wrong id', async () => {
      await expect(service.update('fakeId', {})).rejects.toThrow('Not found');
    });
  });

  describe('Delete', () => {
    let message: Message;

    it('Get message', async () => {
      message = await service.findOneByOrFail({ content: 'patrick' });
    });

    it('Basic', async () => {
      const deleteResult: any = await service.remove(message.id);

      expect(deleteResult).toBe(`${message.id} has been removed`);
      const deletedMessage: Message | null = await service.findOneBy({
        content: 'patrick',
      });
      expect(deletedMessage).toBe(null);
    });

    it('Error - Wrong id', async () => {
      await expect(service.remove('fakeId')).rejects.toThrow('Not found');
    });
  });
});
