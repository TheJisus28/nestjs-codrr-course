import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/users.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { UpdateUserDTO, UserDTO } from '../dto/user.dto';
import { HttpStatus } from '@nestjs/common';
import { ErrorManager } from 'src/utils/error.manager';

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
      throw ErrorManager.handleError(error);
    }
  }

  public async findUsers(): Promise<UserEntity[]> {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async findUserById(id: number): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .getOne();

      if (!user) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found`,
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async updateUser(
    body: UpdateUserDTO,
    id: string,
  ): Promise<UpdateResult | null> {
    try {
      const user: UpdateResult = await this.userRepository.update(id, body);

      if (user.affected === 0) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found`,
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async deleteUser(id: string): Promise<DeleteResult | null> {
    try {
      const user: DeleteResult = await this.userRepository.delete(id);

      if (user.affected === 0) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found`,
        });
      }
      return user;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }
}
