import { Chat } from 'src/chats/entities/chat.entity';
import { MessageTypes } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true, default: null })
  text: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: MessageTypes.Text,
  })
  type: MessageTypes;

  @Column({ type: 'text', nullable: true, default: null })
  file: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  image: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  video: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  audio: string | null;

  @Column({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Chat, { onDelete: 'SET NULL' })
  chat: Chat;

  @UpdateDateColumn()
  updatedAt: string;

  @CreateDateColumn()
  createdAt: string;
}
