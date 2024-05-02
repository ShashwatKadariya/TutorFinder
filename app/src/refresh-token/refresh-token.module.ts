import { Module } from '@nestjs/common';
import { RefreshTokenService } from './refresh-token.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RefreshStrategy } from 'src/auth/strategy';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [RefreshTokenService],
  imports: [PrismaModule],
  exports: [RefreshTokenService],
})
export class RefreshTokenModule {}
