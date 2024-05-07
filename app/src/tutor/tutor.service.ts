import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTutorDto } from './dto';

@Injectable()
export class TutorService {
  constructor(private prisma: PrismaService) {}

  // async create(createTutorDto: CreateTutorDto) {
  //   const { educationQualification, qualification } = createTutorDto;
  //   const tutorCreate = await this.prisma.tutor.create({
  //     data: {
  //       userId: 'test',
  //       educationQualification: {
  //         createMany: {
  //           data: educationQualification.map((data) => ({
  //             institutionName: data.educationInstitutionName,
  //             endDate: new Date(data.educationEndDate),
  //           })),
  //         },
  //       },
  //       teachingExperience: {
  //         createMany: {
  //           data: qualification.map((data) => ({
  //             institutionName: data.experienceInstitutionName,
  //             startDate: new Date(data.experienceStartDate),
  //             endDate: new Date(data.experienceStartDate),
  //           })),
  //         },
  //       },
  //     },
  //   });
  //   return tutorCreate;
  // }

  async createProfile(createTutorDto: CreateTutorDto, userId: string) {
    const { educationQualification, qualification, ...createDto } =
      createTutorDto;
    const tutorProfile = await this.prisma.tutor.create({
      data: {
        userId,
        ...createDto,
        educationQualification: {
          createMany: {
            data: educationQualification.map((data) => ({
              institutionName: data.educationInstitutionName,
              endDate: new Date(data.educationEndDate),
            })),
          },
        },
        teachingExperience: {
          createMany: {
            data: qualification.map((data) => ({
              institutionName: data.experienceInstitutionName,
              startDate: new Date(data.experienceStartDate),
              endDate: new Date(data.experienceStartDate),
            })),
          },
        },
      },
    });

    return tutorProfile;
  }
}
