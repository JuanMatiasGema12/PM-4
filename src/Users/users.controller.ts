import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auths/guards/auth.guard';
import { UpdateUserDto } from './dto/user.dto';
import { Roles } from 'src/roles.decorator';
import { Role } from 'src/role.enum';
import { RolesGuard } from 'src/auths/guards/roles.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { PasswordValidationPipe } from 'src/pipes/password-validate.pipe';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiResponse({
    status: 401,
    description: 'Acceso denegado',
    example: {
      message: 'Access not authorized.',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuarios traidos de la BDD de forma correcta.',
    example: {
      id: '875898a3-6495-4265-9c7c-38cf998379d3',
      name: 'Juan Pérez',
      email: 'juan.perez@example.com',
      phone: 1234567890,
      country: 'Argentina',
      address: 'Av. Siempre Viva 742',
      city: 'Springfield',
      isAdmin: true,
      orders: [
        {
          id: 'af2bb86c-8a89-4246-a287-a0724f2fbedb',
          date: '2024-11-19T15:57:53.171Z',
        },
        {
          id: '0ebc6048-a16c-4a8e-9932-254d81853388',
          date: '2024-11-19T22:11:03.072Z',
        },
      ],
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Recurso prohibido',
    example: {
      message: 'Forbidden resource',
      error: 'Forbidden',
      statusCode: 403,
    },
  })
  @Get()
  @Roles(Role.ADMIN)
  @UseGuards(AuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Obtener todos los usuarios con paginación opcional (admin)',
  })
  @ApiQuery({
    name: 'page',
    description: 'Número de página para la paginación',
    required: false,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Cantidad de resultados por página',
    required: false,
    example: 10,
  })
  async getAllUsers(
    @Query('page') page: number,
    @Query('limit') limit: number,
  ) {
    if (page && limit) {
      return this.usersService.getUsers(page, limit);
    }
    return this.usersService.getUsers(1, 5);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Obtener un usuario por ID (admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con un ID especifico devuelto exitosamente.',
    example: {
      id: '3223c8cf-1f16-4f00-a080-a0346b3cf174',
      name: 'Seba Gema',
      email: 'seba@example.com',
      phone: 1234567890,
      country: 'Argentina',
      address: 'Av. Siempre Viva 742',
      city: 'Springfield',
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
        summary: 'Solicitud incorrecta, datos incorrectos.',
        value: {
          statusCode: 400,
          message: 'Usuario no encontrado',
          error: 'Bad Request',
        },
      },
    },
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Modifica un usuario ya registrado.',
  })
  @ApiBody({
    description: 'Insertar los datos a modificar.',
    examples: {
      'application/json': {
        value: {
          email: 'sebaGema@example.com',
          city: 'Buenos Aires',
          phone: 1234567890,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con un ID especifico modificado exitosamente.',
    example: {
      id: '3223c8cf-1f16-4f00-a080-a0346b3cf174',
      name: 'Seba Gema',
      email: 'sebaGema@example.com',
      phone: 1234567890,
      country: 'Argentina',
      address: 'Av. Siempre Viva 742',
      city: 'Buenos Aires',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Nombres de campos invalidos.',
    example: {
      message: [
        'Aquí irían los nombres de los campos ingresados de forma incorrecta.',
      ],
      error: 'Bad Request',
      statusCode: 400,
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Usuario sin sesión iniciada.',
    example: {
      message: 'Access not authorized.',
      error: 'Unauthorized',
      statusCode: 401,
    },
  })
  @Put(':id')
  @UseGuards(AuthGuard)
  @UsePipes(new PasswordValidationPipe())
  async modifyUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.modifyUser(id, updateUserDto);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Elimina un usuario con un ID especifico.',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuario con un ID especificio no encontrado.',
    example: {
      message: 'User not found',
      error: 'Not Found',
      statusCode: 404,
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Usuario con un ID especifico eliminado exitosamente.',
    example: {
      message:
        'User with id 3223c8cf-1f16-4f00-a080-a0346b3cf174 deleted successfully',
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
  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.deleteUser(id);
  }
}
