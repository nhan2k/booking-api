import { Reservation } from 'src/reservation/entities/reservation.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @Column()
  amount: number;

  @Column({
    enum: ['unpaid', 'paid', 'refuned'],
  })
  status: string;

  @ManyToMany(() => Reservation, (reservation) => reservation.__transactions__)
  __reservations__: Promise<Reservation>;

  @CreateDateColumn()
  created_at: Date; // Creation date

  @UpdateDateColumn()
  updated_at: Date; // Last updated date

  @DeleteDateColumn()
  deleted_at: Date; // Deletion date
}
