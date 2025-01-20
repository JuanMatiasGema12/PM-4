import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Product } from "./products.entity";

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 50, nullable: false, unique: true})
    name: string;

    @OneToMany(() => Product, (product) => product.category)
    products: Product[];
}
