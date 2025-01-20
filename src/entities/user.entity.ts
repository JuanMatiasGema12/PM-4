import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './order.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, nullable: false })
  name: string;

  @Column({ length: 50, unique: true, nullable: false })
  email: string;

  @Column({ length: 60, nullable: false })
  password: string;

  @Column({ type: 'int', nullable: false, select: false })
  phone: number;

  @Column({ length: 50, nullable: false })
  country: string;

  @Column({ type: 'text', nullable: false })
  address: string;

  @Column({ length: 50, nullable: false })
  city: string;

  @Column({ type: 'boolean', default: 'false', select: false })
  isAdmin: boolean;

  @OneToMany(() => Order, (order) => order.user)
  orders: Order[];
}
