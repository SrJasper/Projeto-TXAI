import { Controller,  Get,  Post,  Body,  Patch,  Param,  Delete, Req} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { IUser } from 'src/iterfaces/IUser';
import { Request } from 'express';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    return this.usersService.findAll(req.user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req: Request) {
    return this.usersService.findOne(+id, req.user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto, @Req() req: Request
  ) {
    return this.usersService.update(+id, updateUserDto, req.user);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() user: IUser) {
    return this.usersService.remove(+id, user);
  }

}

