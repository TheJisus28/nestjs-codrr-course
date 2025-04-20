import { IProject } from '../../interfaces/project.interface';
import { BaseEntity } from '../../config/base.entity';

import { Column, Entity, OneToMany } from 'typeorm';
import { UserProjectEntity } from 'src/users/entities/userProjects.entity';

@Entity({ name: 'projects' })
export class ProjectEntity extends BaseEntity implements IProject {
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'text' })
  description: string;

  @OneToMany(() => UserProjectEntity, (userProject) => userProject.project)
  usersIncludes: UserProjectEntity[];
}
