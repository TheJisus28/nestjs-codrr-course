import { IProject } from '../../interfaces/project.interface';
import { BaseEntity } from '../../config/base.entity';

import { Column, Entity, OneToMany } from 'typeorm';
import { UserProjectEntity } from '../../users/entities/userProjects.entity';
import { TaskEntity } from 'src/tasks/entities/tasks.entity';

@Entity({ name: 'projects' })
export class ProjectEntity extends BaseEntity implements IProject {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => UserProjectEntity, (userProject) => userProject.project)
  usersIncludes: UserProjectEntity[];

  @OneToMany(() => TaskEntity, (task) => task.project)
  tasks: TaskEntity[];
}
