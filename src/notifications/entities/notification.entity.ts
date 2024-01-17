import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
}
