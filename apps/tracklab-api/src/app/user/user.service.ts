
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Searches for a user based on the username
   * @param username the username to search for
   */
  async findOne(username: string): Promise<User> {
    return this.prisma.user.findUnique({
      where: { username: username },
      omit: { password: false },
    });
  }

  /**
   * Creates a new user
   * @param data the user creation context
   */
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data,  });
  }
}
