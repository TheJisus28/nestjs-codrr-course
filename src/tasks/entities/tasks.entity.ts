import { TASK_STATUS } from 'src/constants/status-tasks';
import { BaseEntity } from '../../config/base.entity';
import { ProjectEntity } from 'src/projects/entities/projects.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity extends BaseEntity {
  @Column({ type: 'varchar', length: 50 })
  taskName: string;

  @Column({ type: 'text' })
  taskDescription: string;

  @Column({ type: 'enum', enum: TASK_STATUS, default: TASK_STATUS.PENDING })
  status: TASK_STATUS;

  @Column({ type: 'varchar', length: 50 })
  responsableName: string;

  @ManyToOne(() => ProjectEntity, (project) => project.tasks)
  project: ProjectEntity;
}
