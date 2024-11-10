import { Message } from '@src/message/entities/message.entity';
import { BaseEntity } from '@src/services/extra-entity/base-entity.entity';
import { User } from '@src/user/entities/user.entity';
import { Entity, Column, OneToMany, ManyToMany, ManyToOne } from 'typeorm';

@Entity('conversations')
export class Conversation extends BaseEntity {
  @Column({ nullable: false })
  title: string;

  @OneToMany(() => Message, (m: Message) => m.author, {
    onDelete: 'SET NULL',
  })
  messages: Message[];

  @ManyToOne(() => User, (user) => user.createdConversations, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  creator: User;

  @ManyToMany(() => User, (user: User) => user.conversations, {
    cascade: true,
  })
  members: User[];
}
