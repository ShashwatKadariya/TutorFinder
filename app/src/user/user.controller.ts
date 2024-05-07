import {
  Body,
  Controller,
  Post,
  Get,
  UseInterceptors,
  Req,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto';
import { PasswordSanitizerInterceptor } from './interceptor';
import { Public } from 'src/utils';
import { AuthService } from 'src/auth/auth.service';

@UseInterceptors(PasswordSanitizerInterceptor)
@Public()
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Req() req) {
    const userDb = await this.userService.create(createUserDto);
    return userDb;
  }
}
