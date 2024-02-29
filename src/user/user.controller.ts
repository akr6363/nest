import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, UserDto } from './dto/users.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@ApiTags('Users') //для свагера
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiResponse({
    type: [UserDto],
  })
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(5)
  async getUsers() {
    return this.userService.getUsers();
  }

  @Get('/city')
  async getUsersByCity() {
    return this.userService.getUsersByCity();
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Header('Cache-Control', 'none')
  createUser(@Body() createUserDto: CreateUserDto) {
    try {
      const res = this.userService.createUser(createUserDto);
      return res;
    } catch (e) {
      throw new Error(`Couldn't parse filename from header: ${e}`);
    }
  }
}
