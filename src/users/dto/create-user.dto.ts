import { IsEmail, IsString, Length } from "class-validator"

export class CreateUserDto {
  @IsString({message: 'O nome é obrigatorio!'})
  @Length(3, 55, {message: 'Nome deve conter de 3 a 55 caracteres!'})
  name: string

  @IsString({message: 'E-mail deve ser informado!'})
  @IsEmail({}, {message: 'O e-mail não é válido'})
  email: string

  @IsString({message: 'Deve ser informada uma senha!'})
  password: string

  @IsString({message: 'Cargo deve ser informado!'})
  @Length(3, 55, {message: 'Cargo deve ter de 3 a 55 caracteres!'})
  role: string

  confirmPassword: string
}