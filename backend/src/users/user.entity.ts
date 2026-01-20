import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

export type UserRole =
  | 'OWNER'
  | 'NOMINEE'
  | 'ACCESS_NOMINEE'
  | 'VERIFIER'
  | 'ISSUER'
  | 'REVIEWER';

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({ length: 100 })
  full_name: string;

  @Index({ unique: true })
  @Column({ length: 150 })
  email: string;

  @Column({ type: 'text' })
  password_hash: string;

  @Index()
  @Column({ length: 30 })
  role: UserRole;

  @Column({ default: true })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}


