import { ROLES } from '../../constants/roles';
import { IUser } from '../../interfaces/user.interface';

import { BaseEntity } from '../../config/base.entity';
import { Exclude } from 'class-transformer';

import { Column, Entity, OneToMany } from 'typeorm';
import { UserProjectEntity } from './userProjects.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar', length: 50 })
  fistName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'int' })
  age: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  username: string;

  @Exclude()
  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'enum', enum: ROLES, default: ROLES.BASIC })
  role: ROLES;

  @OneToMany(() => UserProjectEntity, (userProject) => userProject.user)
  projectsIncludes: UserProjectEntity[];
}
