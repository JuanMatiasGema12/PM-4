import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/entities/category.entity';
import { Repository } from 'typeorm';
import * as data from "../data.json"



@Injectable()
export class CategoriesService {

    constructor(
        @InjectRepository(Category) private categoriesRepository: Repository<Category>
    ){}

    async addCategories(){
        data.map(async (product) => {
            await this.categoriesRepository
            .createQueryBuilder()
            .insert()
            .into(Category)
            .values({name: product.category})
            .orIgnore()
            .execute()
        })
        
        return 'Categories added'
    }

    async getCategories(){
        return this.categoriesRepository.find()
    }
}
