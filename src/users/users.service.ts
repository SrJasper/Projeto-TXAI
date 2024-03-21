/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /*
  @Body
  name: string
  role: string
  password: string
  passwordConfirmation: string
  admin: boolean
  */
  async create(createUserDto: Prisma.UserCreateInput) {
    const { passwordConfirmation, ...userDataWithoutConfirmation } =
      createUserDto;
    // Verificar se passwordConfirmation coincide com a senha
    if (createUserDto.password !== passwordConfirmation) {
      return 'A senha e a confirmação de senha não coincidem.';
    }

    const newUser = await this.databaseService.user.create({
      data: {
        ...userDataWithoutConfirmation,
        password: await bcrypt.hash(createUserDto.password, 2),
    },
    });

    return newUser;
  }

  async findAll() {
    const users = this.databaseService.user.findMany();
    if(!users) {
      return 'Nenhum usuário cadastrado.';
    } else {
      return users;
    }
  }
  
  async findOne(id: number) {    
    const user = await this.databaseService.user.findUnique({ where: {id}} );
    if(user){ 
      return user;
    } else {
      return 'Usuário não encontrado';
    }
  }

  /*
  @Body
  name?: string
  role?: string
  password?: string
  admin?: boolean
  */
  async update(id: number, updateUserDto: Prisma.UserUpdateInput) {
    const user = await this.databaseService.user.findUnique({ where: {id}} );
    if(user){
      await this.databaseService.user.update({ 
        where: {id},
        data: updateUserDto,
      } );
      return 'usuário deletado';
    } else {
      return 'Nenhum usuário cadastrado com o id: ' + id;
    }
  }

  async remove(id: number) {
    const user = await this.databaseService.user.findUnique({ where: {id}} );
    if(user){
      await this.databaseService.user.delete({ where: {id}} );
      return 'usuário deletado';
    } else {
      return 'Nenhum usuário cadastrado com o id: ' + id;
    }
  }
}
