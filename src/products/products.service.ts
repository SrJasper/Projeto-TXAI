import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { IUser } from 'src/iterfaces/IUser';

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  /*
  @Body
  name?: string
  value?: number
  qnt?: number
  */
  async create(createProductDto: CreateProductDto, user: IUser) {
    console.log(createProductDto);
    if(!user.id){
      throw new BadRequestException('É preciso estar logado para registrar produtos');
    } else {
      const newProduct = await this.databaseService.product.create({
        data: {
          ...createProductDto,
          ownerId: user.id,
        }
      });
      return ('Produto "' + newProduct.name + '" cadastrado com sucesso!');
    }
  }

  async findAll(user: IUser) {
    if(user.admin){
      const allProducts = await this.databaseService.product.findMany();
      if (!allProducts) {
        throw new BadRequestException('Nenhum produto cadastrado.');
    } else {
        return allProducts;
    }
    } else {      
      const products = await this.databaseService.product.findMany({ where: { ownerId: user.id }}); 
      if (!products) {
        throw new BadRequestException('Nenhum produto cadastrado.');
      } else {
        return products;
      }
    }
}


  async findOne(id: number, user: IUser) {
    if(user.admin){
      const adminSearchProduct = await this.databaseService.product.findUnique({ where: {id}});
      if (!adminSearchProduct) {
        throw new BadRequestException('Produto não encontrado');
      } else {
        return adminSearchProduct;
      }
    }else{
      const commonSearchProduct = await this.databaseService.product.findUnique({ where: { 
        id, 
        ownerId: user.id 
    }});
      if(commonSearchProduct){ 
        return commonSearchProduct;
      } else {
        throw new BadRequestException('Produto não encontrado');
      }
    }
  }

  /*
  @Body
  name?: string
  value?: number
  qnt?: number
  */
  async update(id: number, updateProductDto: UpdateProductDto, user:IUser) {
    if(user.admin){
      const adminSearchProduct = await this.databaseService.product.findUnique({ where: {id} });
      if(adminSearchProduct){
        await this.databaseService.product.update({ 
          where: {id},
          data: updateProductDto,
        });
        return 'Produto atualizado';
      } else {
        throw new BadRequestException('Nenhum produto cadastrado com o id: ' + id);
      }
    } else {
      const adminSearchProduct = await this.databaseService.product.findUnique({ where: { 
        id, 
        ownerId: user.id 
    }});
      if(adminSearchProduct){
        await this.databaseService.product.update({ 
          where: {id},
          data: updateProductDto,
        });
        return 'Produto atualizado';
      } else {
        throw new BadRequestException('Nenhum produto cadastrado com o id: ' + id);
      }
    }
    
  }

  async remove(id: number, user: IUser) {
    if(user.admin){
      const product = await this.databaseService.product.findUnique({ where: {id} });
      if(product){
        await this.databaseService.product.delete({ where: {id} });
        return 'Produto deletado';
      } else {
        throw new BadRequestException('Nenhum produto cadastrado com o id: ' + id);
      }
    } else {
      const product = await this.databaseService.product.findUnique({ where: { 
        id, 
        ownerId: user.id 
    }});
      if(product){
        await this.databaseService.product.delete({ where: {id} });
        return 'Produto deletado';
      } else {
        throw new BadRequestException('Nenhum produto cadastrado com o id: ' + id);
      }
    }
  }
}
