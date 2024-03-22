import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Request } from 'express';


@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @Req()req: Request,
  ) {
    return this.productsService.create(createProductDto, req.user);
  }

  @Get()
  findAll(@Req()req: Request) {
    return this.productsService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req()req: Request) {
    return this.productsService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string, 
    @Body() updateProductDto: UpdateProductDto,
    @Req()req: Request){
    return this.productsService.update(+id, updateProductDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string,@Req()req: Request) {
    return this.productsService.remove(+id, req.user);
  }
}
