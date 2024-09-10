import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto): Promise<string> {
    const isCreateUser = await this.userService.createUser(createUserDto);

    if (isCreateUser) return 'create user success.';
  }

  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<User> {
    return await this.userService.getUserById(id);
  }

  @Patch(':id')
  async updateUser(
    @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<string> {
    const isUpdateUser = await this.userService.updateUser(id, updateUserDto);

    if (isUpdateUser) return 'update user success.';
  }

  @Delete(':id')
  async removeUser(@Param('id') id: number): Promise<string> {
    await this.userService.removeUser(id);
    return 'remove user success.';
  }
}
