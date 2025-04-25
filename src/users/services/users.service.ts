import { UserEntity } from '../entities/users.entity';
import { UserProjectEntity } from '../entities/userProjects.entity';
import { UpdateUserDTO, UserDTO, UserToProjectDTO } from '../dto/user.dto';

import { DeleteResult, Repository, DeepPartial } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ErrorManager } from 'src/utils/error.manager';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(UserProjectEntity)
    private readonly userProjectRepository: Repository<UserProjectEntity>,
  ) {}

  public async createUser(body: UserDTO): Promise<UserEntity> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: body.email },
      });

      if (user) {
        throw new ErrorManager({
          type: HttpStatus.CONFLICT,
          message: `User with email ${body.email} already exists`,
        });
      }

      body.password = await bcrypt.hash(
        body.password,
        parseInt(process.env.SALT_ROUNDS || '10'),
      );

      return await this.userRepository.save(body);
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async relationToProject(body: UserToProjectDTO) {
    try {
      return await this.userProjectRepository.save(body);
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

  public async findUserById(id: string): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .where({ id })
        .leftJoinAndSelect('user.projectsIncludes', 'projectsIncludes')
        .leftJoinAndSelect('projectsIncludes.project', 'projects')
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

  public async findBy({
    key,
    value,
  }: {
    key: keyof UserDTO;
    value: string;
  }): Promise<UserEntity | null> {
    try {
      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.password')
        .where({ [key]: value })
        .getOne();

      if (!user) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User with ${key} ${value} not found`,
        });
      }

      return user;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async updateUser(
    id: string,
    body: UpdateUserDTO,
  ): Promise<UserEntity | null> {
    try {
      const rawResult = await this.userRepository
        .createQueryBuilder()
        .update(UserEntity)
        .set(body)
        .where('id = :id', { id })
        .returning('*')
        .execute();

      if (rawResult.affected === 0) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User with ID ${id} not found`,
        });
      }

      if (Array.isArray(rawResult.raw) && rawResult.raw.length > 0) {
        return this.userRepository.merge(
          new UserEntity(),
          rawResult.raw[0] as DeepPartial<UserEntity>,
        );
      }

      return null;
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
