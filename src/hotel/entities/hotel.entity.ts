import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Room } from 'src/room/entities/room.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { User } from 'src/users/entities/user.entity';
import * as moment from 'moment';

@Entity()
export class Hotel {
  @PrimaryGeneratedColumn()
  hotel_id: number;

  @Column({ unique: true })
  hotel_name: string;

  @Column()
  location: string;

  @Column()
  province: string;

  @Column()
  imgPath: string;

  @ManyToOne(() => User, (user) => user.__hotels__)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  __user__: User;

  @OneToMany(() => Room, (room) => room.__hotel__, {
    cascade: true,
  })
  __rooms__: Room[];

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
