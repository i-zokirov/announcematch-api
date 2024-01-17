import { Announcement } from 'src/announcements/entities/announcement.entity';
import { ChatStatus } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('chats')
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @ManyToOne(() => Announcement, { onDelete: 'CASCADE' })
  announcement: Announcement;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: ChatStatus.Open,
  })
  status: ChatStatus;
}
