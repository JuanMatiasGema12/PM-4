import {
  IsUUID,
  ValidateNested,
  ArrayNotEmpty,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class ProductIdDTO {
  @ApiProperty({
    description: 'Identificador único del producto',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}

export class OrderDTO {
  @ApiProperty({
    description: 'Identificador único del usuario',
    example: '123e4567-e89b-12d3-a456-426614174001',
  })
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    description: 'Lista de productos incluidos en la orden',
    type: [ProductIdDTO],
    example: [{ id: '123e4567-e89b-12d3-a456-426614174000' }],
  })
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ProductIdDTO)
  products: ProductIdDTO[];
}
