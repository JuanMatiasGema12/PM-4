import { Controller, Get } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get('seeder')
  addCategories() {
    return this.categoriesService.addCategories();
  }

  @ApiOperation({
    summary: 'Obtiene todas las categorías almacenadas en la BDD',
  })
  @ApiResponse({
    status: 200,
    description: 'Categorías almacenadas en la BDD traidas con exito.',
    example: {
      id: 'adc4246f-cce8-465c-abdb-727f4ea2491b',
      name: 'smartphone',
    },
  })
  @Get()
  getCategories() {
    return this.categoriesService.getCategories();
  }
}
