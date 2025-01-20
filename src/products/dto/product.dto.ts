import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  MaxLength,
  IsOptional,
  IsUUID,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Nombre del producto', example: 'Producto A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Descripción del producto',
    example: 'Una breve descripción del producto A',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Precio del producto', example: 99.99 })
  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ApiProperty({ description: 'Stock disponible del producto', example: 10 })
  @IsNumber()
  @IsNotEmpty()
  stock: number;

  @ApiProperty({
    description: 'URL de la imagen del producto',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  imgUrl: string;

  @ApiProperty({
    description: 'Categoría a la que pertenece el producto',
    example: 'Electronics',
  })
  @IsString()
  @IsNotEmpty()
  @IsUUID('4', { message: 'La categoría debe ser un UUID válido.' })
  category: string;
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}
