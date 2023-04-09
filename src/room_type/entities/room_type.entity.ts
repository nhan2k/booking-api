import * as moment from 'moment';
import { Room } from 'src/room/entities/room.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class RoomType {
  @PrimaryGeneratedColumn()
  room_type_id: number;

  @Column({ nullable: true })
  prize: number;

  @Column({ nullable: true })
  capacity: number;

  @Column({ default: false })
  wifi: boolean;

  @Column({ default: false })
  AC: boolean;

  @Column({ default: false })
  heater: boolean;

  @Column({ nullable: true })
  rating: number;

  @Column({ nullable: true })
  other_facilities: string;

  @ManyToMany(() => Room, (room) => room.__roomTypes__)
  @JoinTable({
    name: 'room_type_rooms',
    joinColumn: {
      name: 'room_type_id',
      referencedColumnName: 'room_type_id',
    },
    inverseJoinColumn: {
      name: 'room_id',
      referencedColumnName: 'room_id',
    },
  })
  __rooms__: Promise<Room[]>;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
