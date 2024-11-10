import { Conversation } from '@src/conversation/entities/conversation.entity';
import { Message } from '@src/message/entities/message.entity';
import { BaseEntity } from '@src/services/extra-entity/base-entity.entity';
import { Entity, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';

@Entity('users')
export class User extends BaseEntity {
  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  firstName: string;

  @Column({ nullable: false })
  lastName: string;

  @Column({ nullable: false })
  password: string;

  @OneToMany(() => Message, (m: Message) => m.author, {
    onDelete: 'SET NULL',
  })
  messages: Message[];

  @OneToMany(
    () => Conversation,
    (conversation: Conversation) => conversation.creator,
    {
      onDelete: 'SET NULL',
    },
  )
  createdConversations: Conversation[];

  @ManyToMany(
    () => Conversation,
    (conversation: Conversation) => conversation.members,
  )
  @JoinTable({
    name: 'conversation_members',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'conversation_id', referencedColumnName: 'id' },
  })
  conversations: Conversation[];
}
