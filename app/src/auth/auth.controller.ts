import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { SignInDto } from './dto';
import { PasswordSanitizerInterceptor } from 'src/user/interceptor';
import { LocalAuthGuard, RefreshAuthGuard } from './guard';
import { ApiResponse, Public } from 'src/utils';
import { ConfigService } from '@nestjs/config';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { Response } from 'express';

import { UserDecorator } from 'src/utils';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/user/dto';

@UseInterceptors(PasswordSanitizerInterceptor)
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
  ) {}

  @Public()
  @Post('signUp')
  async signUp(
    @Body() createUserDto: CreateUserDto,
    @Req() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenInCookie =
      req.cookies?.[
        this.configService.get<string>('jwt.refresh_token.cookie_name')
      ];
    const { access_token, refresh_token } = await this.authService.signup(
      createUserDto,
      tokenInCookie,
      res,
    );
    const responseMessage: ApiResponse<{}> = {
      statusCode: HttpStatus.OK,
      body: {
        message: {
          access_token,
        },
      },
    };
    return responseMessage.body;
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() signInDto: SignInDto,
    @Req() req,
    @UserDecorator() user: User,
    @Res({ passthrough: true }) res: Response,
  ) {
    const tokenInCookie =
      req.cookies?.[
        this.configService.get<string>('jwt.refresh_token.cookie_name')
      ];
    const { access_token, refresh_token } = await this.authService.login(
      user,
      tokenInCookie,
      res,
    );
    const responseMessage: ApiResponse<{}> = {
      statusCode: HttpStatus.OK,
      body: {
        message: {
          access_token,
        },
      },
    };
    return responseMessage.body;
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Get('refresh')
  async refresh(@Req() req, @UserDecorator() user: User, @Res() res: Response) {
    const tokenInCookie =
      req.cookies?.[
        this.configService.get<string>('jwt.refresh_token.cookie_name')
      ];
    const access_token = await this.authService.refresh(
      user,
      tokenInCookie,
      res,
    );

    const responseMessage: ApiResponse<{}> = {
      statusCode: HttpStatus.OK,
      body: {
        message: {
          access_token,
        },
      },
    };

    res.status(responseMessage.statusCode).send(responseMessage.body);
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('logout')
  async logout(@Req() req, @Res() res: Response) {
    const tokenInCookie =
      req.cookies?.[
        this.configService.get<string>('jwt.refresh_token.cookie_name')
      ];
    await this.authService.logout(tokenInCookie, res);
    res.status(HttpStatus.NO_CONTENT).send('');
  }
}
