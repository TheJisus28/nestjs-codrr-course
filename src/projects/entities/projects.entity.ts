import { IProject } from 'src/interfaces/project.interface';
import { BaseEntity, Column, Entity } from 'typeorm';

@Entity({ name: 'projects' })
export class ProjecEntity extends BaseEntity implements IProject {
  @Column({ type: 'varchar', length: 100 })
  name: string;
  @Column({ type: 'text' })
  description: string;
}
