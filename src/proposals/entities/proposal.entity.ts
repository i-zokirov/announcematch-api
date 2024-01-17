import { Announcement } from 'src/announcements/entities/announcement.entity';
import { ProposalDurationType } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('proposals')
export class Proposal {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: false })
  price: number;

  @Column({
    type: 'varchar',
    enum: ProposalDurationType,
    length: 255,
    nullable: false,
  })
  durationType: string;

  @Column({ type: 'int', nullable: false })
  duration: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User;

  @ManyToOne(() => Announcement, { onDelete: 'SET NULL' })
  announcement: Announcement;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
