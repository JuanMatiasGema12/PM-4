import { PartialType } from '@nestjs/mapped-types';
import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsNumber,
  IsEmpty,
  IsOptional,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'El nombre no debe contener caracteres especiales.',
  })
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(50)
  email: string;

  @ApiProperty({
    description: 'Contraseña del usuario',
    example: '!Example123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  password: string;

  @ApiProperty({
    description: 'Confirmación de la contraseña',
    example: '!Example123',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(60)
  confirmPassword: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 5491123456789,
  })
  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @ApiProperty({ description: 'País del usuario', example: 'Argentina' })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'El país no debe contener caracteres especiales.',
  })
  country: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Siempre Viva 742',
  })
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'La dirección no debe contener caracteres especiales.',
  })
  address: string;

  @ApiProperty({ description: 'Ciudad del usuario', example: 'Springfield' })
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-zA-Z0-9\s]+$/, {
    message: 'La ciudad no debe contener caracteres especiales.',
  })
  city: string;

  @IsEmpty()
  isAdmin?: boolean;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @ApiProperty({
    description:
      'Extiende de CreateUserDto, pero todas las propiedades son opcionales para permitir la edición de cualquier campo.',
    example: {
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: 1234567890,
      address: 'Calle Ficticia 123',
      city: 'Buenos Aires',
    },
  })
  @IsOptional()
  description?: string;
}

export class UserResponseDto {
  @ApiProperty({ description: 'Nombre del usuario', example: 'Juan Pérez' })
  @IsString()
  name: string;

  @ApiProperty({
    description: 'Correo electrónico del usuario',
    example: 'juan.perez@example.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Número de teléfono del usuario',
    example: 1234567890,
  })
  @IsNumber()
  phone: number;

  @ApiProperty({ description: 'País del usuario', example: 'Argentina' })
  @IsString()
  country: string;

  @ApiProperty({
    description: 'Dirección del usuario',
    example: 'Av. Siempre Viva 742',
  })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Ciudad del usuario', example: 'Springfield' })
  @IsString()
  city: string;
}
