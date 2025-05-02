import { Module } from '@nestjs/common';
import { TasksService } from './services/tasks.service';
import { TasksController } from './controllers/tasks.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './entities/tasks.entity';
import { ProjectEntity } from 'src/projects/entities/projects.entity';
import { ProjectsService } from 'src/projects/services/projects.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskEntity, ProjectEntity])],
  providers: [TasksService, ProjectsService],
  controllers: [TasksController],
})
export class TasksModule {}
