import { Announcement } from 'src/announcements/entities/announcement.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'categories' })
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  name: string;

  @ManyToMany(() => Announcement, (announcement) => announcement.categories, {
    onDelete: 'SET NULL',
  })
  announcements: Announcement[];

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;
}
