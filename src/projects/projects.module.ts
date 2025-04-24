import { Module } from '@nestjs/common';
import { ProjectsController } from './controllers/projects.controller';
import { ProjectsService } from './services/projects.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEntity } from './entities/projects.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEntity])],
  providers: [ProjectsService],
  controllers: [ProjectsController],
})
export class ProjectsModule {}
