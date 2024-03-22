import { IsString, Length, IsNumber, IsOptional} from "class-validator"

export class UpdateProductDto{
  @IsOptional()
  @IsString({message: 'O nome do produto é obrigatorio!'})
  @Length(3, 55, {message: 'O nome do produto deve conter de 3 a 55 caracteres!'})
  name: string

  @IsOptional()
  @IsNumber({},{message: 'O produto deve ter um valor'})
  value: number

  @IsOptional()
  @IsNumber({},{message: 'Insira uma quantidade de produtos no estoque'})
  qnt: number
}