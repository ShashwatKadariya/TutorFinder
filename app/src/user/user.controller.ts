import { Body, Controller, Post, Get, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { PasswordSanitizerInterceptor } from './interceptor';
import { Public } from 'src/utils';

@UseInterceptors(PasswordSanitizerInterceptor)
@Public()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
}
