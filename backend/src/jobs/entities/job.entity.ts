import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobs')
@Index(['source', 'externalId'], { unique: true })
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'external_id' })
  externalId: string;

  @Column()
  title: string;

  @Column()
  company: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  location: string | null;

  @Column({
    type: 'boolean',
    nullable: true,
  })
  remote: boolean | null;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  category: string | null;

  @Column()
  source: string;

  @Column({ name: 'source_url', type: 'text' })
  sourceUrl: string;

  @Column({
    name: 'published_at',
    type: 'timestamptz',
    nullable: true,
  })
  publishedAt: Date | null;

  @Column({
    name: 'fetched_at',
    type: 'timestamptz',
  })
  fetchedAt: Date;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt: Date;
}