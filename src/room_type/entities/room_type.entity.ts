import * as moment from 'moment';
import { Review } from 'src/review/entities/review.entity';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn()
  room_type_id: number;

  @Column()
  prize: number;

  @Column()
  capacity: number;

  @Column({ type: 'boolean', default: false })
  wifi: boolean;

  @Column({ type: 'boolean', default: false })
  AC: boolean;

  @Column({ type: 'boolean', default: false })
  heater: boolean;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  other_facilities: string;

  @OneToOne(() => Room, (room) => room.__roomType__, {
    cascade: true,
  })
  @JoinColumn({
    name: 'room_id',
  })
  __room__: Room;

  @OneToMany(() => Review, (review) => review.__roomType__)
  __reviews__: Review[];

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
