import { Announcement } from 'src/announcements/entities/announcement.entity';
import { ChatStatus } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'text',
    nullable: false,
  })
  title: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @ManyToMany(() => User, (user) => user.chats, { onDelete: 'SET NULL' })
  @JoinTable()
  participants: User[];

  @ManyToOne(() => Announcement, { onDelete: 'SET NULL' })
  announcement: Announcement;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: ChatStatus.Open,
  })
  status: ChatStatus;

  @UpdateDateColumn()
  updatedAt: string;

  @CreateDateColumn()
  createdAt: string;
}
