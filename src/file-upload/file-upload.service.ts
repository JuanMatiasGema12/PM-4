import { Injectable, NotFoundException } from '@nestjs/common';
import { FileUploadRepository } from './file-upload.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/products.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FileUploadService {
  constructor(
    private fileUploadRepository: FileUploadRepository,
    @InjectRepository(Product) private productsRepository: Repository<Product>,
  ) {}

  async uploadImage(file: Express.Multer.File, id: string) {
    try {
      const product = await this.productsRepository.findOneBy({ id: id });
      if (!product) {
        throw new NotFoundException('Product not found.');
      }
      const uploadImage = await this.fileUploadRepository.uploadImage(file);
      await this.productsRepository.update(product.id, {
        imgUrl: uploadImage.secure_url,
      });
      return await this.productsRepository.findOneBy({ id: id });
    } catch {
      throw new NotFoundException('Product not found.');
    }
  }
}
