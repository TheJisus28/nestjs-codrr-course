import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/tasks.entity';
import { Repository } from 'typeorm';
import { ErrorManager } from 'src/utils/error.manager';
import { TaskDTO } from '../dto/task.dto';
import { ProjectsService } from 'src/projects/services/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
    private readonly projectService: ProjectsService,
  ) {}

  public async createTask(
    body: TaskDTO,
    projectId: string,
  ): Promise<TaskEntity> {
    try {
      const project = await this.projectService.findProjectById(projectId);
      if (!project) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `Project with ID ${projectId} not found`,
        });
      }

      return await this.taskRepository.save({
        ...body,
        project,
      });
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }
}
