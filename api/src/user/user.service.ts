import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseService } from '@src/services/base.service';
import { HashService } from '@src/services/hash/hash.service';

@Global()
@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly hashService: HashService,
  ) {
    super(userRepository);
  }

  async create(dto: CreateUserDTO, entityManager?: EntityManager) {
    if (await this.findOneBy({ email: dto.email }, [], {}, entityManager))
      throw new HttpException(
        'User with this email already exist',
        HttpStatus.BAD_REQUEST,
      );
    return await super.create(
      {
        ...dto,
        password: await this.hashService.hash(dto.password),
      },
      entityManager,
    );
  }
}
