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

  @Column()
  prize: number;

  @Column()
  capacity: number;

  @Column()
  wifi: number;

  @Column()
  AC: number;

  @Column()
  heater: number;

  @Column()
  rating: number;

  @Column()
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
