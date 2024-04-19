import { PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number | undefined;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date | undefined;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date | undefined;
}
