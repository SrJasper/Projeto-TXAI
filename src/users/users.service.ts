import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { genSalt, hash } from 'bcryptjs'
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/iterfaces/IUser';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: DatabaseService) {}

  /*
  @Body
  name: string
  email: string
  role: string
  password: string
  passwordConfirmation: string
  admin: boolean
  */
  async create(createUserDto: CreateUserDto) {
    const { confirmPassword, ...userData } = createUserDto;

    if (createUserDto.password !== confirmPassword) {
      throw new BadRequestException('A senha e a confirmação de senha não coincidem.');
    }

    const salt = await genSalt(10);
    const passHash = await hash(createUserDto.password, salt);

    try{
      const newUser = await this.databaseService.user.create({
        data: {
          ...userData,
          password: passHash,
        },
      });
      return 'O usuário de ' + newUser.name + ' foi criado!';
    } catch{ 
      throw new BadRequestException('O e-mail colocado já está cadastrado');
    }    
  }


  async findAll(user: IUser) {
    if(!user.admin) {
      throw new BadRequestException('Usuário não é um administrador!')
    }
    const users = this.databaseService.user.findMany();
    if(!users) {
      throw new BadRequestException('Nenhum usuário cadastrado.');
    } else {
      return users;
    }
  }
  
  async findOne(id: number, user: IUser) {
    if(!user.admin) {
      throw new BadRequestException('Usuário não é um administrador!')
    }   
    const userDB = await this.databaseService.user.findUnique({ where: {id}} );
    if(userDB){ 
      return userDB;
    } else {
      throw new BadRequestException('Usuário não encontrado');
    }
  }

  /*
  @Body
  name?: string
  password?: string
  role?: string
  admin?: boolean
  */
  async update(id: number, updateUserDto: UpdateUserDto, user: IUser) {
    console.log('user: ' + user.name);

    if(!user.admin && id !== user.id) {
      throw new BadRequestException('Usuário sem permissão para realizar a modificação');
    }
    if(updateUserDto.password){
      if(updateUserDto.password !== updateUserDto.confirmPassword){
        throw new BadRequestException('As senhas devem ser iguais para alterá-las');
      }
    }
    const userDB = await this.databaseService.user.findUnique({ where: {id}} );
    if(!user.admin){
      await this.databaseService.user.update({ 
        where: {id},
        data:{
          ...updateUserDto,
          admin: false,
        },
      });
      return 'O seu usuário foi alterado, ' + updateUserDto.name;
    } else {
      if(userDB){
        await this.databaseService.user.update({ 
          where: {id},
          data: updateUserDto,
        } );
        return 'O usuário do ' + updateUserDto.name + ' foi alterado ';
      } else {
        throw new BadRequestException('Nenhum usuário cadastrado com o id: ' + id);
      }
    }
  }

  async remove(id: number, user: IUser) {

    if(!user.admin || id !== user.id){
      throw new BadRequestException("Usuário não tem permissão para deletar!")
    }

    const userDb = await this.databaseService.user.findUnique({ where: {id}} );

    if(userDb){
      await this.databaseService.user.delete({ where: {id}} );
      return 'usuário deletado';
    } else {
      throw new BadRequestException('Nenhum usuário cadastrado com o id: ' + id);
    }
  }
}
