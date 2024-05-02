import {
  ForbiddenException,
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

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private refreshTokenService: RefreshTokenService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneWithEmail(email);
    if (!user) return null;
    if (!(await this.userService.verifyPassword(password, user.password))) {
      return null;
    }
    return user;
  }

  async validateUserJwt(id: string) {
    const user = await this.userService.findOneWithId(id);
    if (!user) return null;
    return user;
  }

  async login(user: User, tokenInCookie: string, res: Response) {
    const payload: JwtType = {
      email: user.email,
      sub: user.id,
    };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.refresh_token.key'),
      expiresIn: this.configService.get<string>('jwt.refresh_token.expiresIn'),
    });

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
    const refreshTokenInDb = await this.refreshTokenService.createRefreshToken(
      refresh_token,
      user.id,
    );
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

    const tokenInDB = await this.refreshTokenService.createRefreshToken(
      refresh_token,
      user.id,
    );

    res.cookie(
      this.configService.get<string>('jwt.refresh_token.cookie_name'),
      refresh_token,
      refreshTokenCookieConfig,
    );
    return access_token;
  }
}
