import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectEntity } from '../entities/projects.entity';
import { DeepPartial, DeleteResult, Repository } from 'typeorm';
import { ProjectDTO, UpdateProjectDTO } from '../dto/project.dto';
import { ErrorManager } from 'src/utils/error.manager';
import { ACCESS_LEVEL } from 'src/constants/roles';
import { UsersService } from 'src/users/services/users.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>,
    private readonly userService: UsersService,
  ) {}

  public async createProject(body: ProjectDTO, ownerId: string) {
    try {
      const user = await this.userService.findUserById(ownerId);

      if (!user) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `User with ID ${ownerId} not found`,
        });
      }

      const project = await this.projectRepository.save(body);

      return await this.userService.relationToProject({
        user,
        project,
        accessLevel: ACCESS_LEVEL.OWNER,
      });
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async findProjects(): Promise<ProjectEntity[]> {
    try {
      return await this.projectRepository.find();
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async findProjectById(id: string): Promise<ProjectEntity | null> {
    try {
      const project = await this.projectRepository
        .createQueryBuilder('project')
        .where({ id })
        .leftJoinAndSelect('project.usersIncludes', 'usersIncludes')
        .leftJoinAndSelect('usersIncludes.user', 'users')
        .getOne();

      if (!project) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `Project with ID ${id} not found`,
        });
      }

      return project;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async updateProject(
    id: string,
    body: UpdateProjectDTO,
  ): Promise<ProjectEntity | null> {
    try {
      const rawResult = await this.projectRepository
        .createQueryBuilder()
        .update(ProjectEntity)
        .set(body)
        .where('id = :id', { id })
        .returning('*')
        .execute();

      if (rawResult.affected === 0) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `Project with ID ${id} not found`,
        });
      }

      if (Array.isArray(rawResult.raw) && rawResult.raw.length > 0) {
        return this.projectRepository.merge(
          new ProjectEntity(),
          rawResult.raw[0] as DeepPartial<ProjectEntity>,
        );
      }

      return null;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }

  public async deleteProject(id: string): Promise<DeleteResult | null> {
    try {
      const project: DeleteResult = await this.projectRepository.delete(id);

      if (project.affected === 0) {
        throw new ErrorManager({
          type: HttpStatus.NOT_FOUND,
          message: `Project with ID ${id} not found`,
        });
      }

      return project;
    } catch (error) {
      throw ErrorManager.handleError(error);
    }
  }
}
