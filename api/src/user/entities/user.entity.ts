import { BaseEntity } from '@src/services/extra-entity/base-entity.entity';
import { Entity, Column } from 'typeorm';

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
}
