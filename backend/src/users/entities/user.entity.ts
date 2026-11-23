import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  name: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ name: 'password_hash' })
  passwordHash: string;

  @Column({
    type: 'varchar',
    length: 150,
    nullable: true,
  })
  location: string | null;

  @Column('text', {
    array: true,
    default: () => "'{}'",
  })
  skills: string[];

  @Column('text', {
    array: true,
    default: () => "'{}'",
  })
  interests: string[];

  @Column({
    name: 'experience_years',
    type: 'int',
    default: 0,
  })
  experienceYears: number;

  @Column({
    name: 'preferred_remote',
    type: 'boolean',
    default: false,
  })
  preferredRemote: boolean;

  @CreateDateColumn()
  createdAt: Date;
}