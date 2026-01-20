import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';
import { User } from '../users/user.entity';

@Entity({ name: 'assets' })
export class Asset {
  @PrimaryGeneratedColumn('uuid')
  asset_id: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @Index()
  @Column({ type: 'uuid' })
  owner_id: string;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  type: string | null;

  @Column({ type: 'text' })
  encrypted_cid: string;

  @Column({ type: 'text', nullable: true })
  content_hash: string | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'assigned_nominee_id' })
  assigned_nominee: User | null;

  @Index()
  @Column({ type: 'uuid', nullable: true })
  assigned_nominee_id: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}


