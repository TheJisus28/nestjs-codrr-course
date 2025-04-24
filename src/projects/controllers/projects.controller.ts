import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { ProjectsService } from '../services/projects.service';
import { ProjectDTO } from '../dto/project.dto';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectService: ProjectsService) {}

  @Post('create')
  public async createProject(@Body() body: ProjectDTO) {
    return await this.projectService.createProject(body);
  }

  @Get('all')
  public async getAllProjects() {
    return await this.projectService.findProjects();
  }

  @Get(':id')
  public async getProjectById(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projectService.findProjectById(id);
  }

  @Get('update/:id')
  public async updateProject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: ProjectDTO,
  ) {
    return await this.projectService.updateProject(id, body);
  }

  @Get('delete/:id')
  public async deleteProject(@Param('id', ParseUUIDPipe) id: string) {
    return await this.projectService.deleteProject(id);
  }
}
