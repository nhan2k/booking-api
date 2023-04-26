import { Exclude, Expose } from 'class-transformer';
import * as moment from 'moment';
import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Reservation } from 'src/reservation/entities/reservation.entity';
import { Review } from 'src/review/entities/review.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  phone_number: string;

  @Column({ nullable: true })
  location: string;

  @Column({ default: 'user' })
  role: string;

  @Column({ nullable: true })
  imgPath: string;

  @OneToMany(() => Reservation, (reservation) => reservation.__user__, {
    cascade: true,
  })
  @JoinColumn([
    { name: 'reservation_id', referencedColumnName: 'reservation_id' },
  ])
  __reservations__: Reservation[];

  @OneToMany(() => Hotel, (hotel) => hotel.__user__, {
    cascade: true,
  })
  @JoinColumn([{ name: 'hotel_id', referencedColumnName: 'hotel_id' }])
  __hotels__: Hotel[];

  @OneToMany(() => Review, (review) => review.__user__, {
    cascade: true,
  })
  @JoinColumn([{ name: 'review_id', referencedColumnName: 'review_id' }])
  __reviews__: Review[];

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date

  @Expose()
  get full_name(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}
