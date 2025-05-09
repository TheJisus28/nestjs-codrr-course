import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
} from 'class-validator';
import { ACCESS_LEVEL, ROLES } from 'src/constants/roles';
import { UserEntity } from '../entities/users.entity';
import { ProjectEntity } from 'src/projects/entities/projects.entity';

export class UserDTO {
  @IsNotEmpty()
  @IsString()
  fistName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  age: number;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEnum(ROLES)
  role: ROLES;
}

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  fistName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsNumber()
  age: number;

  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsEnum(ROLES)
  role: ROLES;
}

export class GetUserByIdDTO {
  @IsUUID()
  id: string;
}

export class UserToProjectDTO {
  @IsUUID()
  @IsNotEmpty()
  user: UserEntity;

  @IsUUID()
  @IsNotEmpty()
  project: ProjectEntity;

  @IsNotEmpty()
  @IsEnum(ACCESS_LEVEL)
  accessLevel: ACCESS_LEVEL;
}
