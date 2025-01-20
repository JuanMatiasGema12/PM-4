/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, UserResponseDto } from './dto/user.dto';
import { v4 as uuidv4 } from 'uuid';
import { response } from 'express';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async getUsers(page: number, limit: number) {
    const [users] = await this.usersRepository.findAndCount({
      relations: ['orders', 'orders.orderDetails.products'],
      skip: (page - 1) * limit,
      take: limit,
      select: [
        'id',
        'name',
        'email',
        'phone',
        'country',
        'address',
        'city',
        'isAdmin',
      ],
    });

    const user = users[0];
    const orders = user.orders;
    const newOrderDetails = user.orders.map((orderDetail) => {
      let response = [];
      for (const product of orderDetail.orderDetails[0].products) {
        response.push({ img: product.imgUrl, name: product.name });
      }
      return { price: orderDetail.orderDetails[0].price, products: response };
    });

    const returnObject = { ...user, orders: newOrderDetails };

    return returnObject;
  }

  async getUserById(id: string): Promise<UserResponseDto> {
    try {
      const userFound = await this.usersRepository.findOne({
        where: { id },
        select: ['id', 'name', 'email', 'phone', 'country', 'address', 'city'],
      });

      if (!userFound) {
        throw new BadRequestException('Usuario no encontrado');
      }

      return userFound;
    } catch {
      throw new BadRequestException('Usuario no encontrado');
    }
  }

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const newUser = this.usersRepository.create(createUserDto);

    newUser.id = uuidv4();
    return await this.usersRepository.save(newUser);
  }

  async modifyUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto | string> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, updateUserDto);
    await this.usersRepository.save(user);

    const { password, ...updatedUser } = user;
    return updatedUser;
  }

  async deleteUser(id: string): Promise<{ message: string }> {
    try {
      const user = await this.usersRepository.findOne({ where: { id } });
      console.log(user.id);
      if (!user) {
        throw new BadRequestException('User not found.');
      }
      await this.usersRepository.remove(user);
      return { message: `User with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('User not found');
    }
  }
}
