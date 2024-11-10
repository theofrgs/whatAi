import { Injectable } from '@nestjs/common';
import { getUsersSeed } from './data/users.seed';
import { UserService } from '@src/user/user.service';
import { User } from '@src/user/entities/user.entity';
import { ALoggerService } from '../logger.service';

@Injectable()
export class SeedService extends ALoggerService {
  constructor(private readonly userService: UserService) {
    super();
  }

  private async seedUsers(): Promise<User[]> {
    const result: User[] = [];
    for (const userData of getUsersSeed(process.env)) {
      result.push(await this.userService.create(userData));
    }
    return result;
  }

  private async customSeed<T>(
    service: { create: (...args: any[]) => Promise<T> },
    seedData: any[],
  ): Promise<T[]> {
    const result: T[] = [];
    for (const data of seedData) {
      result.push(await service.create(...data));
    }
    return result;
  }

  async seedAll(): Promise<void> {
    await this.seedUsers();
    // await this.customSeed(
    //   this.folderService,
    //   getFoldersSeed().map((folderDto) => [folderDto, users[0]]),
    // );
    // await this.customSeed(
    //   this.lawyerService,
    //   getLawyersSeed().map((lawyerDto) => [lawyerDto]),
    // );

    this.logger.log('🚀 ~ SeedService ~ seedAll ~ ✅: Seeding completed');
  }
}
