import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { CreateTutorDto, QualificationDto } from './dto';
import { ApiResponse, Public, UserDecorator } from 'src/utils';
import { TutorService } from './tutor.service';
import { CreateUserDto } from 'src/user/dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { Response } from 'express';

@Controller('tutor')
export class TutorController {
  constructor(
    private tutorService: TutorService,
    private authService: AuthService,
  ) {}

  @Public()
  @Post('signUp')
  async create(
    @Body() createUserDto: CreateUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    createUserDto['isTutor'] = true;
    return await this.authService.signup(createUserDto, null, res);
  }

  @Post('create-profile')
  async createTutor(
    @Body() createTutorDto: CreateTutorDto,
    @UserDecorator() user,
  ) {
    const data = await this.tutorService.createProfile(createTutorDto, user.id);
    const responseMessage: ApiResponse<{}> = {
      statusCode: HttpStatus.OK,
      body: {
        message: 'created',
      },
    };
    return responseMessage.body;
  }
}
