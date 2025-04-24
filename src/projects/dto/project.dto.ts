import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class ProjectDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}

export class UpdateProjectDTO {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class GetProjectByIdDTO {
  @IsUUID()
  id: string;
}
