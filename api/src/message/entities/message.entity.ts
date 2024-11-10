import { Conversation } from '@src/conversation/entities/conversation.entity';
import { BaseEntity } from '@src/services/extra-entity/base-entity.entity';
import { User } from '@src/user/entities/user.entity';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity('messages')
export class Message extends BaseEntity {
  @Column({ nullable: false })
  content: string;

  @ManyToOne(() => User, (user) => user.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  author: User;

  @ManyToOne(() => Conversation, (conversation) => conversation.messages, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  conversation: Conversation;
}
