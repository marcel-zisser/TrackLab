import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth/auth.service';
import { StorageService } from '../storage/storage.service';

@Module({
  controllers: [UserController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    PrismaService,
    StorageService,
  ],
})
export class UserModule {}
