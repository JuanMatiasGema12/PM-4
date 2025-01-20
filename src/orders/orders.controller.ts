import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderDTO } from './dto/order.dto';
import { AuthGuard } from 'src/auths/guards/auth.guard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Realiza el post de una orden.',
  })
  @ApiBody({
    description: 'Insertar los datos de la orden.',
    examples: {
      'application/json': {
        value: {
          userId: 'a232279b-0618-4684-aba8-65b60a6c1e48',
          products: [
            { id: '18ab3b2e-6fec-4623-a4c6-60b64b3b3a13' },
            { id: '193101a2-8511-40b4-9c1a-424362523683' },
          ],
        },
      },
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
      'Error por campos vacios': {
        summary: 'Solicitud incorrecta, datos incorrectos.',
        value: {
          message: [
            'Aquí van los campos que no están completos, con sus respectivas constraints',
          ],
          error: 'Bad Request',
          statusCode: 400,
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Orden creada con éxito.',
    example: {
      orderId: '6291339e-3f01-4df2-9dd4-8bd7ff8ede0e',
      orderDate: '2024-11-20T19:56:46.005Z',
      totalPrice: 49.99,
      orderDetailId: '1420bf76-d3cb-45a9-be3a-230f94e7b0de',
    },
  })
  @Post()
  @UseGuards(AuthGuard)
  async addOrder(@Body() orderDTO: OrderDTO) {
    return this.ordersService.addOrder(orderDTO);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Trae una orden especifica por ID',
  })
  @ApiResponse({
    status: 200,
    description: 'Trae la orden solicitada por ID de forma correcta',
    example: {
      id: 'af2bb86c-8a89-4246-a287-a0724f2fbedb',
      date: '2024-11-19T15:57:53.171Z',
      orderDetails: [
        {
          id: '66201e9f-087c-401f-9ba6-280caf986cce',
          price: '99.99',
          products: [
            {
              id: '6e6b5288-5357-45aa-a1cd-6d0487590153',
              name: 'Razer BlackWidow V3',
              description: 'The best keyboard in the world',
              price: '99.99',
              stock: 12,
              imgUrl:
                'https://res.cloudinary.com/dq0jzbp09/image/upload/v1732034915/dkkvoqid6rvufzcljbon.jpg',
            },
          ],
        },
      ],
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
          message: 'El id ingresado de la orden a buscar no es del tipo UUID.',
          error: 'Bad Request',
        },
      },
      'Error por campos no validos': {
        summary: 'Solicitud incorrecta, datos incorrectos.',
        value: {
          statusCode: 400,
          message: 'Order not found',
          error: 'Bad Request',
        },
      },
    },
  })
  @Get(':id')
  @UseGuards(AuthGuard)
  async getOrder(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrder(id);
  }
}
