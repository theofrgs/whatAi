import { Global, Injectable } from '@nestjs/common';
import { CreateMessageDTO } from './dto/create-message.dto';
import { Message } from './entities/message.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseService } from '@src/services/base.service';

@Global()
@Injectable()
export class MessageService extends BaseService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: Repository<Message>,
  ) {
    super(messageRepository);
  }

  create(dto: CreateMessageDTO, entityManager?: EntityManager) {
    return super.create(dto, entityManager);
  }
}
