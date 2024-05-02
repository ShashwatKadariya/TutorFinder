import { ApiProperty } from "@nestjs/swagger";
import {
    IsBoolean,
    IsEmail,
    IsNotEmpty,
    IsOptional,
    IsString,
    MaxLength,
    MinLength
} from 'class-validator'
import { Match } from "src/utils";

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(5)
    @MaxLength(25)
    @ApiProperty()
    username: string;

    @IsEmail()
    @IsNotEmpty()
    @ApiProperty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @ApiProperty()
    password: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(20)
    @Match('password', {message: "Passwords do not match"})
    @ApiProperty()
    passwordConfirmation: string;
}