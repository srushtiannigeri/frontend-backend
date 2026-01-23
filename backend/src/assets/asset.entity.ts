import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn
} from 'typeorm';

@Entity({ name: 'assets' })
export class Asset {
  @PrimaryGeneratedColumn('uuid', { name: 'asset_id' })
  asset_id: string;

  @Index()
  @Column({ type: 'varchar', length: 255, name: 'owner_id' })
  owner_id: string; // Wallet address stored as string

  @Column({ length: 255, name: 'title' })
  title: string;

  @Column({ type: 'varchar', length: 100, nullable: true, name: 'type' })
  type: string | null;

  @Column({ type: 'text', name: 'encrypted_cid' })
  encrypted_cid: string;

  @Column({ type: 'text', nullable: true, name: 'content_hash' })
  content_hash: string | null;

  @Index()
  @Column({ type: 'varchar', length: 255, nullable: true, name: 'assigned_nominee_id' })
  assigned_nominee_id: string | null; // Wallet address stored as string

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  created_at: Date;
}


