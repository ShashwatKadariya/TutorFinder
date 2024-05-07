import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { CreateUserDto } from 'src/user/dto';
import { JustDate, Match } from 'src/utils';

class EducationQualificationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  educationInstitutionName: string;

  @IsDateString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  @JustDate('educationEndDate')
  educationEndDate: string;
}
export class QualificationDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  experienceInstitutionName: string;

  @IsDateString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  @JustDate('experienceStartDate')
  experienceStartDate: string;

  @IsDateString()
  @IsNotEmpty()
  @MinLength(1)
  @ApiProperty()
  @JustDate('experienceEndDate')
  experienceEndDate: string;
}

export class CreateTutorDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(20)
  @MaxLength(500)
  @ApiProperty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @ApiProperty()
  tagline: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationQualificationDto)
  @ApiProperty()
  educationQualification: EducationQualificationDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QualificationDto)
  @ApiProperty()
  qualification: QualificationDto[];

  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  @ApiProperty()
  introVideoLink: string;
}
