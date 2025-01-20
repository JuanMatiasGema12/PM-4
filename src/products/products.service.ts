import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Product } from '../entities/products.entity';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as data from '../data.json';
import { Category } from 'src/entities/category.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private productsRepository: Repository<Product>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}

  async getProducts(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['category'],
    });
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['category'],
      });
      if (!product) {
        throw new BadRequestException('Product not found.');
      }
      return product;
    } catch {
      throw new BadRequestException('Product not found.');
    }
  }

  async createProduct(createProductDto: CreateProductDto): Promise<Product> {
    const { name, category } = createProductDto;

    const existingProduct = await this.productsRepository.findOne({
      where: { name },
    });

    if (existingProduct) {
      throw new BadRequestException(
        `El producto con el nombre "${name}" ya existe.`,
      );
    }

    const existingCategory = await this.categoriesRepository.findOne({
      where: { id: category },
    });

    if (!existingCategory) {
      throw new BadRequestException(
        `La categoría con el ID "${category}" no existe.`,
      );
    }

    try {
      const newProduct = this.productsRepository.create({
        ...createProductDto,
        category: existingCategory,
      });

      return await this.productsRepository.save(newProduct);
    } catch {
      throw new BadRequestException(
        'Ocurrió un error al guardar el producto. Intente nuevamente.',
      );
    }
  }

  async modifyProduct(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | string> {
    try {
      const product = await this.productsRepository.findOne({ where: { id } });

      if (!product) {
        throw new NotFoundException(`Product with id ${id} not found`);
      }

      Object.assign(product, updateProductDto);

      return await this.productsRepository.save(product);
    } catch (error) {
      if (error.name === 'QueryFailedError') {
        throw new BadRequestException(
          'Ocurrió un error al actualizar el producto. Por favor, verifique los datos.',
        );
      }

      throw error;
    }
  }

  async deleteProduct(id: string): Promise<{ message: string }> {
    try {
      const user = await this.productsRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException('Product not found.');
      }
      await this.productsRepository.remove(user);
      return { message: `Product with id ${id} deleted successfully` };
    } catch {
      throw new BadRequestException('Product not found');
    }
  }

  async addProducts(): Promise<string> {
    const categories = await this.categoriesRepository.find();

    data?.map(async (e) => {
      const category = categories.find(
        (category) => category.name === e.category,
      );

      const product = new Product();
      product.name = e.name;
      product.description = e.description;
      product.price = e.price;
      product.stock = e.stock;
      product.category = category;

      await this.productsRepository
        .createQueryBuilder()
        .insert()
        .into(Product)
        .values(product)
        .orUpdate(['description', 'price', 'imgUrl', 'stock'], ['name'])
        .execute();
    });
    return 'Products added';
  }
}
