import { Hotel } from 'src/hotel/entities/hotel.entity';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  reservation_id: number;

  @Column()
  guest_list: number;

  @Column({ type: 'timestamp' })
  check_in: Date;

  @Column({ type: 'timestamp' })
  checkout: Date;

  @Column()
  balance_amount: number;

  @Column()
  note: number;

  @Column({
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  status: string;

  @ManyToOne(() => Hotel, (hotel) => hotel.__reservations__)
  @JoinColumn([{ name: 'hotel_id', referencedColumnName: 'hotel_id' }])
  __hotel__: Hotel;

  @ManyToOne(() => User, (user) => user.__reservations__)
  @JoinColumn([{ name: 'user_id', referencedColumnName: 'user_id' }])
  __user__: User;

  @ManyToMany(
    () => Transaction,
    (transaction) => transaction.__reservations__,
    {
      cascade: true,
    },
  )
  @JoinTable({
    name: 'payment',
    joinColumn: {
      name: 'reservation_id',
      referencedColumnName: 'reservation_id',
    },
    inverseJoinColumn: {
      name: 'transaction_id',
      referencedColumnName: 'transaction_id',
    },
  })
  __transactions__: Promise<Transaction[]>;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
