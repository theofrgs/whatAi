import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Conversation } from './entities/conversation.entity';
import { ConversationService } from './conversation.service';
import { ConversationController } from './conversation.controller';
import { HashService } from '@src/services/hash/hash.service';

@Module({
  imports: [TypeOrmModule.forFeature([Conversation])],
  controllers: [ConversationController],
  providers: [ConversationService, HashService],
  exports: [ConversationService],
})
export class ConversationModule {}
