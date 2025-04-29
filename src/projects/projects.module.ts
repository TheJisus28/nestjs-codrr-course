import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/projects.entity';
import { UserProjectEntity } from 'src/users/entities/userProjects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity, UserProjectEntity])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
