
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(username: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { username: username },
      omit: { password: false },
    });
  }
}
