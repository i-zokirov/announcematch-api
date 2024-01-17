import { UserRoles } from 'src/types/enums';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  firstname: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  lastname: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  @Index({ unique: true })
  email: string;

  @Column({
    type: 'varchar',
    enum: UserRoles,
    default: UserRoles.Publisher,
    length: 255,
    nullable: false,
  })
  role: UserRoles;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  phone: string;

  @UpdateDateColumn()
  updatedAt: string;

  @CreateDateColumn()
  createdAt: string;
}
