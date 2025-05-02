import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO } from '../dto/project.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { PublicAccess } from 'src/auth/decorators/public.decorator';
import { ACCESS_LEVEL } from 'src/constants/roles';

@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @PublicAccess()
  @Post('create/ownerId/:ownerId')
  public async createProject(
    @Body() body: ProjectDTO,
    @Param('ownerId') ownerId: string,
  ) {
    return await this.projectService.createProject(body, ownerId);
  }

  @Get('all')
  public async getAllProjects() {
    return await this.projectService.findProjects();
  }

  @Get(':ProjectId')
  public async getProjectById(@Param('ProjectId', ParseUUIDPipe) id: string) {
    return await this.projectService.findProjectById(id);
  }

  @AccessLevel(ACCESS_LEVEL.OWNER)
  @Put('update/:ProjectId')
  public async updateProject(
    @Param('ProjectId', ParseUUIDPipe) id: string,
    @Body() body: ProjectDTO,
  ) {
    return await this.projectService.updateProject(id, body);
  }

  @Get('delete/:ProjectId')
  public async deleteProject(@Param('ProjectId', ParseUUIDPipe) id: string) {
    return await this.projectService.deleteProject(id);
  }
}
