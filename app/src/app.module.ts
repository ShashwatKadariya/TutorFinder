import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development'],
      isGlobal: true,
      load: [configuration],
    }),
    PrismaModule,
    AuthModule,
    UserModule,
    RefreshTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService, RefreshTokenService],
})
export class AppModule {}
