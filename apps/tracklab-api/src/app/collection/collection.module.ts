import { Module } from '@nestjs/common';
import { CollectionController } from './collection.controller';
import { CollectionService } from './collection.service';
import { StorageService } from '../storage/storage.service';
import { PrismaService } from '../../prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Module({
  controllers: [CollectionController],
  providers: [
    CollectionService,
    StorageService,
    PrismaService,
    UserService,
    JwtService,
  ],
})
export class CollectionModule {}
