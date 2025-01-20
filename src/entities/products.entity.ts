import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, ManyToMany } from "typeorm";
import { Category } from "./category.entity";
import { OrderDetail } from "./orderDetail.entity";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, nullable: false, unique: true})
    name: string;

    @Column({ type: 'text', nullable: false })
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price: number;

    @Column({ type: 'int', nullable: false })
    stock: number;

    @Column({ default: 'imagen de ejemplo.' })
    imgUrl: string;

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    @ManyToMany(() => OrderDetail, (orderDetail) => orderDetail.products)
    orderDetails: OrderDetail[];
}
