import {
  BadRequestException,
  Controller,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from 'src/auths/guards/auth.guard';
import {
  ApiTags,
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('FileUpload')
@Controller('files')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Sube una imagen asociada a un recurso específico' })
  @ApiParam({
    name: 'id',
    description: 'ID del recurso al cual se asociará la imagen',
    example: '64c91a74-d2e4-4b2f-b4a4-e4f9ecfddc42',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Archivo de imagen a subir',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'ID de producto no encontrado,',
    example: {
      message: 'Product not found.',
      error: 'Not Found',
      statusCode: 404,
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
  @ApiResponse({
    status: 201,
    description:
      'Imagen del producto con ID especifico subida de forma correcta.',
    example: {
      id: '18ab3b2e-6fec-4623-a4c6-60b64b3b3a13',
      name: 'Razer Viper',
      description: 'The best mouse in the world',
      price: '49.99',
      stock: 12,
      imgUrl:
        'https://res.cloudinary.com/dq0jzbp09/image/upload/v1732130037/ibxg1vpqeaxsqg6ilw7w.jpg',
    },
  })
  @Post('uploadImage/:id')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'File must be max size 200kb',
          }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/bmp',
      'image/webp',
      'image/svg+xml',
    ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Invalid file type. Only images are allowed.',
      );
    }
    return this.fileUploadService.uploadImage(file, id);
  }
}
