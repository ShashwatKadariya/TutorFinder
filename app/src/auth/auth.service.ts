import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { SignInDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { JwtType } from 'src/utils';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';
import { Response } from 'express';
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from 'src/config';
import { User } from '@prisma/client';
import { refreshTokenCreate } from 'src/refresh-token/types';
import { CreateUserDto } from 'src/user/dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async signup(
    createUserDto: CreateUserDto,
    tokenInCookie: string,
    res: Response,
  ) {
    const user = await this.userService.create(createUserDto);
    return await this.login(user, tokenInCookie, res);
  }

  async login(user: User, tokenInCookie: string, res: Response) {
    const payload: JwtType = {
      email: user.email,
      sub: user.id,
    };
    // reuse detection
    if (tokenInCookie) {
      const foundRefreshToken =
        await this.refreshTokenService.findRefreshTokenByToken(tokenInCookie);
      if (!foundRefreshToken || foundRefreshToken.userId !== user.id) {
        await this.refreshTokenService.deleteAllRefreshTokenOfUser(user.id);
      } else {
        await this.refreshTokenService.deleteRefreshTokenByToken(tokenInCookie);
      }
      res.clearCookie(
        this.configService.get<string>('jwt.refresh_token.cookie_name'),
        clearRefreshTokenCookieConfig,
      );
    }
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refresh_token.key'),
      expiresIn: this.configService.get<string>('jwt.refresh_token.expiresIn'),
    });

    const createRefreshInput: refreshTokenCreate = {
      refresh_token,
      kind: 'userId',
      userId: user.id,
    };
    const refreshTokenInDb =
      await this.refreshTokenService.createRefreshToken(createRefreshInput);
    res.cookie(
      this.configService.get<string>('jwt.refresh_token.cookie_name'),
      refresh_token,
      refreshTokenCookieConfig,
    );
    return {
      access_token,
      refresh_token,
    };
  }

  async logout(tokenInCookie: string, res: Response) {
    if (!tokenInCookie) throw new UnauthorizedException();
    const foundTokenInDb =
      await this.refreshTokenService.findRefreshTokenByToken(tokenInCookie);

    if (foundTokenInDb) {
      await this.refreshTokenService.deleteRefreshTokenByToken(tokenInCookie);
    }
    res.clearCookie(
      this.configService.get<string>('jwt.refresh_token.cookie_name'),
      clearRefreshTokenCookieConfig,
    );
  }

  async refresh(user: any, token: string, res: Response) {
    if (!token) throw new UnauthorizedException();
    res.clearCookie(
      this.configService.get<string>('jwt.refresh_token.cookie_name'),
      clearRefreshTokenCookieConfig,
    );
    const refreshTokenInDb =
      await this.refreshTokenService.findRefreshTokenByToken(token);
    if (!refreshTokenInDb) {
      console.log('Attempted refresh token resuse');
      throw new ForbiddenException();
    }
    await this.refreshTokenService.deleteRefreshTokenByToken(token);
    const payload: JwtType = {
      email: user.email,
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refresh_token.key'),
      expiresIn: this.configService.get<string>('jwt.refresh_token.expiresIn'),
    });
    const createRefreshInput: refreshTokenCreate = {
      refresh_token,
      kind: 'userId',
      userId: user.id,
    };
    const tokenInDB =
      await this.refreshTokenService.createRefreshToken(createRefreshInput);

    res.cookie(
      this.configService.get<string>('jwt.refresh_token.cookie_name'),
      refresh_token,
      refreshTokenCookieConfig,
    );
    return access_token;
  }
}
