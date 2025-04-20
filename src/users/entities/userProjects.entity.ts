import { ACCESS_LEVEL } from 'src/constants/roles';
import { BaseEntity } from 'src/config/base.entity';
import { UserEntity } from './users.entity';
import { ProjectEntity } from 'src/projects/entities/projects.entity';

import { Column, Entity, ManyToOne } from 'typeorm';

@Entity({ name: 'user_projects' })
export class UserProjectEntity extends BaseEntity {
  @Column({ type: 'enum', enum: ACCESS_LEVEL })
  accessLevel: ACCESS_LEVEL;

  @ManyToOne(() => UserEntity, (user) => user.projectsIncludes)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.usersIncludes)
  project: ProjectEntity;
}
