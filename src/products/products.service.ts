/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /*
  @Body
  name?: string
  value?: number
  qnt?: number
  */
  async create(createProductDto: Prisma.ProductCreateInput) {
    //ATRIBUIR O OWNERID AO PRODUTO
    await this.databaseService.product.create({ 
      data: createProductDto
    });
    return 'Produto cadastrado';
  }

  async findAll() {
    const products = this.databaseService.product.findMany();
    if(!products) {
      return 'Nenhum produto cadastrado.';
    } else {
      return products;
    }
  }

  async findOne(id: number) {
    const product = await this.databaseService.product.findUnique({ where: {id}} );
    if(product){ 
      return product;
    } else {
      return 'Produto não encontrado';
    }
  }

  /*
  @Body
  name?: string
  value?: number
  qnt?: number
  */
  async update(id: number, updateProductDto: Prisma.ProductUpdateInput) {
    const product = await this.databaseService.product.findUnique({ where: {id}} );
    if(product){
      await this.databaseService.product.update({ 
        where: {id},
        data: updateProductDto,
      } );
      return 'Produto deletado';
    } else {
      return 'Nenhum produto cadastrado com o id: ' + id;
    }
  }

  async remove(id: number) {
    const product = await this.databaseService.product.findUnique({ where: {id}} );
    if(product){
      await this.databaseService.product.delete({ where: {id}} );
      return 'Produto deletado';
    } else {
      return 'Nenhum produto cadastrado com o id: ' + id;
    }
  }
}
