import * as moment from 'moment';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
  ManyToMany,
} from 'typeorm';

@Entity()
export class Room {
  @PrimaryGeneratedColumn()
  room_id: number;

  @Column()
  capacity: number;

  @Column({ type: 'double precision' })
  prize: number;

  @Column({
    nullable: true,
  })
  facilities: string;

  @Column()
  imgPath: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.rooms)
  @JoinColumn([{ name: 'hotel_id', referencedColumnName: 'hotel_id' }])
  __hotel__: Hotel;

  @ManyToMany(() => RoomType, (roomType) => roomType.__rooms__, {
    cascade: true,
  })
  __roomTypes__: Promise<RoomType[]>;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
