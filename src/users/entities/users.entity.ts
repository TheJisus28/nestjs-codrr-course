import { BaseEntity } from 'src/config/base.entity';
import { IUser } from 'src/interfaces/user.interface';
import { Column, Entity } from 'typeorm';

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

  @Column({ type: 'varchar', length: 100 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  role: string;
}
