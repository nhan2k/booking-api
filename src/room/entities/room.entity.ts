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
  OneToOne,
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

  @Column({
    nullable: true,
    enum: ['pending', 'published', 'concealed'],
    default: 'pending',
  })
  status: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.__rooms__)
  @JoinColumn([{ name: 'hotel_id', referencedColumnName: 'hotel_id' }])
  __hotel__: Hotel;

  @OneToOne(() => RoomType, (roomType) => roomType.__room__)
  __roomType__: RoomType;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
