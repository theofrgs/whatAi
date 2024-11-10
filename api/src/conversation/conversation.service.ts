import { Global, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateConversationDTO } from './dto/create-conversation.dto';
import { Conversation } from './entities/conversation.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { BaseService } from '@src/services/base.service';

@Global()
@Injectable()
export class ConversationService extends BaseService<Conversation> {
  constructor(
    @InjectRepository(Conversation)
    private readonly conversationRepository: Repository<Conversation>,
  ) {
    super(conversationRepository);
  }

  async create(dto: CreateConversationDTO, entityManager?: EntityManager) {
    if (await this.findOneBy({ title: dto.title }, [], {}, entityManager))
      throw new HttpException(
        'Conversation with this title already exist',
        HttpStatus.BAD_REQUEST,
      );
    return await super.create(dto, entityManager);
  }
}
