import { IsNumber, IsString, Length } from "class-validator"

export class CreateProductDto {
  @IsString({message: 'O nome do produto é obrigatorio!'})
  @Length(3, 55, {message: 'O nome do produto deve conter de 3 a 55 caracteres!'})
  name: string

  @IsNumber({},{message: 'O produto deve ter um valor'})
  value: number
  
  @IsNumber({},{message: 'Insira uma quantidade de produtos no estoque'})
  qnt: number
}