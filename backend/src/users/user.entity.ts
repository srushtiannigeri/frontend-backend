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
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  user_id: string;

  @Column({ length: 100, name: 'full_name' })
  full_name: string;

  @Index({ unique: true })
  @Column({ length: 150, name: 'email' })
  email: string;

  @Column({ type: 'text', name: 'password_hash' })
  password_hash: string;

  @Index()
  @Column({ length: 30, name: 'role' })
  role: UserRole;

  @Column({ default: true, name: 'is_active' })
  is_active: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updated_at: Date;
}


