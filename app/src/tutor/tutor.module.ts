import { Module } from '@nestjs/common';
import { TutorService } from './tutor.service';
import { TutorController } from './tutor.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UserModule } from 'src/user/user.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';

@Module({
  providers: [TutorService],
  controllers: [TutorController],
  imports: [PrismaModule, AuthModule],
  exports: [TutorService],
})
export class TutorModule {}
