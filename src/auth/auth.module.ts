import { Global, Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './controllers/auth.controller';
import { UsersService } from 'src/users/services/users.service';
import { UsersModule } from 'src/users/users.module';

@Global()
// This module is marked as global, meaning its providers will be available throughout the application
// without needing to import it in every module.
// This is useful for services that are used across multiple modules, such as authentication services.
@Module({
  imports: [UsersModule],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
