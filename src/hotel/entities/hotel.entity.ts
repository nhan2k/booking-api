import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  hotel_id: number;

  @Column()
  hotel_name: string;

  @Column()
  location: string;

  @Column({ type: 'text' })
  owner: string;

  @OneToMany(() => Room, (room) => room.__hotel__, {
    cascade: true,
  })
  rooms: Room[];

  @OneToMany(() => Reservation, (reservation) => reservation.__hotel__, {
    cascade: true,
  })
  __reservations__: Reservation[];

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
