import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/entities/order.entity';
import { OrderDetail } from 'src/entities/orderDetail.entity';
import { Product } from 'src/entities/products.entity';
import { User } from 'src/entities/user.entity';
import { v4 as uuidv4 } from 'uuid';
import { OrderDTO } from './dto/order.dto';
import { isUUID } from 'class-validator';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private ordersRepository: Repository<Order>,
    @InjectRepository(OrderDetail)
    private orderDetailsRepository: Repository<OrderDetail>,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getOrder(orderId: string): Promise<any> {
    const order = await this.ordersRepository.findOne({
      where: { id: orderId },
      relations: ['orderDetails', 'orderDetails.products'],
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async addOrder(order: OrderDTO) {
    const userFound = await this.usersRepository.findOne({
      where: { id: order.userId },
    });
    if (!userFound) {
      throw new NotFoundException('User not found');
    }

    const newOrder = this.ordersRepository.create({
      id: uuidv4(),
      user: userFound,
      date: new Date(),
    });

    await this.ordersRepository.save(newOrder);

    let totalPrice = 0;
    const productsToAdd: Product[] = [];

    for (const product of order.products) {
      if (!isUUID(product.id)) {
        throw new BadRequestException(
          `El ID del producto "${product.id}" no es un UUID válido.`,
        );
      }

      const productFound = await this.productsRepository.findOne({
        where: { id: product.id },
      });

      if (!productFound) {
        throw new NotFoundException(
          `El producto con el ID "${product.id}" no existe.`,
        );
      }

      if (productFound.stock <= 0) {
        throw new BadRequestException(
          `El producto con el ID "${product.id}" no tiene stock disponible.`,
        );
      }

      productsToAdd.push(productFound);
      totalPrice += parseFloat(productFound.price.toString());
    }

    const newOrderDetail = this.orderDetailsRepository.create({
      price: totalPrice,
      order: newOrder,
      products: productsToAdd,
    });

    await this.orderDetailsRepository.save(newOrderDetail);

    return {
      orderId: newOrder.id,
      orderDate: newOrder.date,
      totalPrice: totalPrice,
      orderDetailId: newOrderDetail.id,
    };
  }
}
