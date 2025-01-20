import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Product } from '../entities/products.entity';
import { ProductsService } from './products.service';
import { AuthGuard } from 'src/auths/guards/auth.guard';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiOperation({
    summary: 'Trae todos los productos almacenados en la BDD.',
  })
  @ApiResponse({
    status: 200,
    description: 'Devuelve el array de todos los productos en la BDD.',
    example: {
      id: '193101a2-8511-40b4-9c1a-424362523683',
      name: 'Iphone 15',
      description: 'The best smartphone in the world',
      price: '199.99',
      stock: 12,
      imgUrl: 'imagen de ejemplo.',
      category: {
        id: 'adc4246f-cce8-465c-abdb-727f4ea2491b',
        name: 'smartphone',
      },
    },
  })
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productsService.getProducts();
  }

  @Get('seeder')
  async addProducts() {
    return this.productsService.addProducts();
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Un usuario ya registrado crea un nuevo producto.',
  })
  @ApiBody({
    description: 'Insertar los datos del producto a crear.',
    examples: {
      'application/json': {
        value: {
          name: 'Producto A',
          description: 'Una breve descripción del producto A',
          price: 99.99,
          stock: 10,
          imgUrl: 'https://example.com/image.jpg',
          category:
            'Éste sería el ID de la categoría del producto: 9a30b6df-cc50-41a3-8f63-0b6cbd0bf57e',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Producto creado de forma exitosa.',
    example: {
      name: 'Producto A',
      description: 'Una breve descripción del producto A',
      price: 99.99,
      stock: 10,
      imgUrl: 'https://example.com/image.jpg',
      category:
        'Éste sería el ID de la categoría del producto: 9a30b6df-cc50-41a3-8f63-0b6cbd0bf57e',
      id: 'Éste sería el category_id: 4a5f1e8f-7051-45e3-b5b9-128827c3e2c0',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de tipeo de nombre de campo // Campos incompletos.',
    example: {
      message: [
        'Aquí van a ir los nombres de los campos sin completar, o aquellos que estén mal escritos.',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @Post()
  @UseGuards(AuthGuard)
  async createProduct(
    @Body() createProductDto: CreateProductDto,
  ): Promise<Product> {
    return this.productsService.createProduct(createProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Trae un producto con un ID especifico.',
  })
  @ApiResponse({
    status: 200,
    description: 'Producto con ID especifico traido de forma correcta.',
    example: {
      id: '193101a2-8511-40b4-9c1a-424362523683',
      name: 'Iphone 15',
      description: 'The best smartphone in the world',
      price: '199.99',
      stock: 12,
      imgUrl: 'imagen de ejemplo.',
      category: {
        id: 'adc4246f-cce8-465c-abdb-727f4ea2491b',
        name: 'smartphone',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Access Denied.',
    example: {
      message: 'Access not authorized.',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error del tipo UUID.',
    example: {
      message: 'El id ingresado del usuario a buscar no es del tipo UUID.',
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @UseGuards(AuthGuard)
  @Get(':id')
  async getProductById(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Product | undefined> {
    return this.productsService.getProductById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Modifica un producto por id (admin)' })
  @ApiBody({
    description: 'Inserte los datos del producto a modificar.',
    examples: {
      'application/json': {
        value: {
          name: 'Producto B',
          description: 'El producto B es el mejor del mundo !',
          price: 120,
          stock: 20,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Producto modificado correctamente.',
    example: {
      id: '193101a2-8511-40b4-9c1a-424362523683',
      name: 'Producto B',
      description: 'El producto B es el mejor del mundo !',
      price: 120,
      stock: 20,
      imgUrl: 'imagen de ejemplo.',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta, datos inválidos.',
    examples: {
      'Error del tipo UUID': {
        summary: 'Error en el tipo de datos',
        value: {
          statusCode: 400,
          message: 'El id ingresado del usuario a buscar no es del tipo UUID.',
          error: 'Bad Request',
        },
      },
      'Error por campos no validos': {
        summary: 'Solicitud incorrecta, campos incorrectos.',
        value: {
          message: [
            'Aquí van a ir los nombres de los campos que fueron ingresados de forma incorrecta',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @Put(':id')
  @UseGuards(AuthGuard)
  async modifyProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Promise<Product | string> {
    return this.productsService.modifyProduct(id, updateProductDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Elimina un producto con un ID especifico.',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta, campos invalidos.',
    examples: {
      'Error del tipo UUID': {
        summary: 'Error en el tipo de datos',
        value: {
          statusCode: 400,
          message: 'El id ingresado del usuario a buscar no es del tipo UUID.',
          error: 'Bad Request',
        },
      },
      'Error por campos no validos': {
        summary: 'Solicitud incorrecta, campos incorrectos.',
        value: {
          message: 'Product not found.',
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Producto con un ID especifico eliminado de forma correcta.',
    example: {
      message:
        'Product with id 193101a2-8511-40b4-9c1a-424362523683 deleted successfully',
    },
  })
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteProduct(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    return this.productsService.deleteProduct(id);
  }
}
