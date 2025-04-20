import { BaseEntity } from 'src/config/base.entity';
import { IUser } from 'src/interfaces/user.interface';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar', length: 50 })
  fistName: string;

  @Column()
  lastName: string;

  @Column()
  age: number;

  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column()
  role: string;
}
