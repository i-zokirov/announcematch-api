import { Announcement } from 'src/announcements/entities/announcement.entity';
import { ProposalDurationType, ProposalStatus } from 'src/types/enums';
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

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @Column({
    type: 'varchar',
    enum: ProposalStatus,
    length: 255,
    nullable: false,
  })
  status: ProposalStatus;

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
