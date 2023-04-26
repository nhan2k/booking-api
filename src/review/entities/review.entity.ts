import { Reservation } from 'src/reservation/entities/reservation.entity';
import { RoomType } from 'src/room_type/entities/room_type.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @Column()
  rating: number;

  @Column()
  description: string;

  @ManyToOne(() => User, (user) => user.__reviews__)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  __user__: User;

  @ManyToOne(() => RoomType, (roomType) => roomType.__reviews__)
  @JoinColumn([{ name: 'room_type_id', referencedColumnName: 'room_type_id' }])
  __roomType__: RoomType;

  @OneToOne(() => Reservation, (reservation) => reservation.__review__)
  @JoinColumn([
    { name: 'reservation_id', referencedColumnName: 'reservation_id' },
  ])
  __reservation__: Reservation;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
