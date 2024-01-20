import { Category } from 'src/categories/entities/category.entity';
import { Proposal } from 'src/proposals/entities/proposal.entity';
import { AnnouncementStatus } from 'src/types/enums';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'announcements' })
export class Announcement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'text', nullable: true, default: null })
  image: string | null;

  @Column({ type: 'text', nullable: true, default: null })
  imageAssetId: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: false,
    default: AnnouncementStatus.Draft,
  })
  status: AnnouncementStatus;

  @OneToOne(() => Proposal, { onDelete: 'SET NULL' })
  @JoinColumn()
  acceptedProposal: Proposal | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  expiresAt: string | null;

  @Column({ type: 'timestamptz', nullable: true, default: null })
  archivedAt: string | null;

  @JoinTable()
  @ManyToMany(() => Category, (category) => category.announcements, {
    onDelete: 'SET NULL',
  })
  categories: Category[];

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  createdBy: User | null;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
