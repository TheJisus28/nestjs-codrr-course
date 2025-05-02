import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TaskDTO } from '../dto/task.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AccessLevelGuard } from 'src/auth/guards/access-level.guard';
import { AccessLevel } from 'src/auth/decorators/access-level.decorator';
import { ACCESS_LEVEL } from 'src/constants/roles';

@Controller('tasks')
@UseGuards(AuthGuard, RolesGuard, AccessLevelGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @AccessLevel(ACCESS_LEVEL.DEVELOPER)
  @Post('create/projectId/:projectId')
  public async createTask(
    @Body() body: TaskDTO,
    @Param('projectId') projectId: string,
  ) {
    return await this.tasksService.createTask(body, projectId);
  }
}
