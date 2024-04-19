import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class SliderImage extends BaseEntity {
  @Column({ nullable: false })
  url: string | undefined;
}
