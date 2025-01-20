import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Order } from './order.entity';
import { Product } from './products.entity';

@Entity('order_details')
export class OrderDetail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  price: number;

  @ManyToOne(() => Order, (order) => order.orderDetails)
  @JoinColumn({
    name: 'order_id',
  })
  order: Order;

  @ManyToMany(() => Product, (products) => products.orderDetails)
  @JoinTable({
    name: 'order_detail_products',
    joinColumn: { name: 'order_detail_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'product_id', referencedColumnName: 'id' },
  })
  products: Product[];
}
