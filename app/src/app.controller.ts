import {
  Controller,
  Get,
  UseGuards,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard, LocalAuthGuard, RefreshAuthGuard } from './auth/guard';
import { PasswordSanitizerInterceptor } from './user/interceptor';
import { ConfigService } from '@nestjs/config';
import { Public } from './utils';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
