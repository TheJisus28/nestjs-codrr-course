import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDTO, UserDTO } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  public async createUser(body: UserDTO): Promise<UserEntity> {
    try {
      return await this.userRepository.save(body);
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async findUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async findUserById(id: number): Promise<UserEntity | null> {
    try {
      return await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .getOne();
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async updateUser(
    body: UpdateUserDTO,
    id: string,
  ): Promise<UpdateResult | null> {
    try {
      const user: UpdateResult = await this.userRepository.update(id, body);

      if (user.affected === 0) {
        return null;
      }
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult | null> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id);

      if (user.affected === 0) {
        return null;
      }
      return user;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : String(error));
    }
  }
}
