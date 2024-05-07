import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { refreshTokenCreate } from './types';
import { RefreshToken } from '@prisma/client';

@Injectable()
export class RefreshTokenService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async createRefreshToken(input: refreshTokenCreate) {
    let refreshTokenDb: RefreshToken;
    if (input.kind === 'userId') {
      refreshTokenDb = await this.prisma.refreshToken.create({
        data: {
          token: input.refresh_token,
          userId: input.userId,
          tutorId: null,
        },
      });
    } else if (input.kind === 'tutorId') {
      refreshTokenDb = await this.prisma.refreshToken.create({
        data: {
          token: input.refresh_token,
          userId: null,
          tutorId: input.tutorId,
        },
      });
    }
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
