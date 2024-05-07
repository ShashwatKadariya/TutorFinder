import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto';
import * as argon2 from 'argon2';
import { PrismaClientValidationError } from '@prisma/client/runtime/library';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async hashPassword(password: string) {
    const hash = await argon2.hash(password);
    return hash;
  }

  async verifyPassword(password: string, hash: string) {
    return (await argon2.verify(hash, password)) ? true : false;
  }

  async validateUser(email: string, password: string) {
    const user = await this.findOneWithEmail(email);
    if (!user) return null;
    if (!(await this.verifyPassword(password, user.password))) {
      return null;
    }
    return user;
  }

  async validateUserJwt(id: string) {
    const user = await this.findOneWithId(id);
    if (!user) return null;
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    const { passwordConfirmation, ...createDto } = createUserDto;
    createDto['password'] = await this.hashPassword(createDto['password']);
    return await this.prisma.user.create({
      data: createDto,
    });
  }

  async findOneWithEmail(email: string) {
    const user = this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return user;
  }

  async findOneWithId(id: string) {
    const user = this.prisma.user.findFirst({
      where: {
        id,
      },
    });
    return user;
  }
}
