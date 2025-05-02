import { TASK_STATUS } from '../../constants/status-tasks';
import { BaseEntity } from '../../config/base.entity';
import { ProjectEntity } from '../../projects/entities/projects.entity';
import { ITask } from '../../interfaces/task.interface';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity implements ITask {
  @Column({ type: 'varchar', length: 50 })
  taskName: string;

  @Column({ type: 'text' })
  taskDescription: string;

  @Column({ type: 'enum', enum: TASK_STATUS, default: TASK_STATUS.PENDING })
  status: TASK_STATUS;

  @Column({ type: 'varchar', length: 50 })
  responsableName: string;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;
}
