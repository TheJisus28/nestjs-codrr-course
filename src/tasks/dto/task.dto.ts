import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TASK_STATUS } from 'src/constants/status-tasks';
import { ITask } from 'src/interfaces/task.interface';
import { ProjectDTO } from 'src/projects/dto/project.dto';

export class TaskDTO implements ITask {
  @IsNotEmpty()
  @IsString()
  taskName: string;

  @IsNotEmpty()
  @IsString()
  taskDescription: string;

  @IsNotEmpty()
  @IsEnum(TASK_STATUS)
  status: TASK_STATUS;

  @IsNotEmpty()
  @IsString()
  responsableName: string;

  @IsOptional()
  project?: ProjectDTO;
}
