import { Body, Controller, Param, Post } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TaskDTO } from '../dto/task.dto';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create/projectId/:projectId')
  public async createTask(
    @Body() body: TaskDTO,
    @Param('projectId') projectId: string,
  ) {
    return await this.tasksService.createTask(body, projectId);
  }
}
