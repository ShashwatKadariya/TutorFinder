import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { RefreshStrategy } from 'src/auth/strategy';
import {
  clearRefreshTokenCookieConfig,
  refreshTokenCookieConfig,
} from 'src/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtType } from 'src/utils';

@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createRefreshToken(token: string, userId: string) {
    const refreshTokenDb = await this.prisma.refreshToken.create({
      data: {
        token,
        userId,
      },
    });
    return refreshTokenDb;
  }

  async findRefreshTokenByToken(token: string) {
    const foundRefreshToken = await this.prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
    return foundRefreshToken;
  }

  async deleteAllRefreshTokenOfUser(userId: string) {
    await this.prisma.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }

  async deleteRefreshTokenByToken(token: string) {
    await this.prisma.refreshToken.delete({
      where: {
        token,
      },
    });
  }
}
